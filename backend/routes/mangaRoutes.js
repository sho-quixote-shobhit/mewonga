const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler')
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { exec } = require('child_process');
const axios = require('axios')

//models
const User = require('../models/user')
const Panel = require('../models/panel')
const Chapter = require('../models/chapter')
const Genre = require('../models/genre')
const Manga = require('../models/manga')


//to store chapter.pdf 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: function (req, file, cb) {
        const extname = 'chapter.pdf'
        cb(null, extname);
    },
});
const upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } });


//upload manga and 1 chapter
router.post('/upload', upload.single('pdf'), asyncHandler(async (req, res, next) => {
    const { title, desc, cover, chapName, chapNumber, genres, status, userId } = req.body;
    try {
        if (!title || !desc || !cover || !chapName || !chapNumber || !genres || !status || !userId) {
            res.json({ msg: "Data incomplete" })
        } else {

            const pdfPath = req.file.path;
            if (!fs.existsSync(pdfPath)) {
                res.json({ msg: "Provide a chapter" })
            }

            const outputDirectory = path.join(__dirname, 'temp');
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory);
            }

            //using exec and pdftoppm to convert pdf to images first and store those images in temp then converting them to base64 images
            //separate each image of pdf and convert then to base64
            exec(`pdftoppm -jpeg ${pdfPath} ${path.join(outputDirectory, 'page')}`, async (error, stdout, stderr) => {
                const pageImagesBase64 = []; // storing all the images of pdf in this array in base64 strings
                const files = fs.readdirSync(outputDirectory);
                files.forEach((file) => {
                    const pageImagePath = path.join(outputDirectory, file);
                    const pageImageBuffer = fs.readFileSync(pageImagePath);
                    const pageImageBase64 = pageImageBuffer.toString('base64');
                    pageImagesBase64.push(pageImageBase64);
                });

                //delete each image created
                files.forEach((file) => {
                    const pageImagePath = path.join(outputDirectory, file);
                    fs.unlinkSync(pageImagePath);
                });

                //delete the chapter.pdf
                fs.unlinkSync(pdfPath);
                const manga_genres = genres.split(',');

                const genres_to_upload = [manga_genres]

                //creating new manga
                const new_manga = new Manga({
                    title,
                    desc,
                    cover,
                    status,
                    author: userId
                })

                //genres of manga
                for (let index = 0; index < manga_genres.length; index++) {
                    const genre = await Genre.findOne({ genre: manga_genres[index] })
                    new_manga.genres.push(genre)
                }
                await new_manga.save();

                //creating new chapter
                const new_chapter = new Chapter({
                    chapName,
                    chapNumber,
                    author: userId
                })
                await new_chapter.save();

                //saving all panels of the chapter
                for (let index = 0; index < pageImagesBase64.length; index++) {
                    const new_panel = new Panel({
                        page: pageImagesBase64[index],
                        pageNo: index + 1,
                        author: userId
                    })
                    await new_panel.save();
                    new_chapter.pages.push(new_panel);
                }

                await new_chapter.save();
                new_manga.chapters.push(new_chapter);
                await new_manga.save();

                const user = await User.findById(userId).exec();
                user.mangas.push(new_manga);
                await user.save();

            });

            res.json({ msg: "ok" })
        }
    } catch (error) {
        res.json({ msg: "Server Error" })
    }
}))

// add new chapter to existing manga
router.post('/newchapter', upload.single('pdf'), asyncHandler(async (req, res) => {
    const { chapterName, chapterNumber, mangaId, userId } = req.body;
    try {
        if (!chapterName || !chapterNumber || !mangaId || !userId) {
            res.json({ msg: "Data incomplete" })
        } else {

            const pdfPath = req.file.path;
            if (!fs.existsSync(pdfPath)) {
                res.json({ msg: "Provide a chapter" })
            }

            const outputDirectory = path.join(__dirname, 'temp');
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory);
            }
            exec(`pdftoppm -jpeg ${pdfPath} ${path.join(outputDirectory, 'page')}`, async (error, stdout, stderr) => {
                if (error) {
                    res.json({ msg: "server error" })
                }

                const pageImagesBase64 = []; // storing all the images of pdf in this array in base64 strings
                const files = fs.readdirSync(outputDirectory);
                files.forEach((file) => {
                    const pageImagePath = path.join(outputDirectory, file);
                    const pageImageBuffer = fs.readFileSync(pageImagePath);
                    const pageImageBase64 = pageImageBuffer.toString('base64');
                    pageImagesBase64.push(pageImageBase64);
                });

                //delete each image created
                files.forEach((file) => {
                    const pageImagePath = path.join(outputDirectory, file);
                    fs.unlinkSync(pageImagePath);
                });

                //delete the chapter.pdf
                fs.unlinkSync(pdfPath);

                const new_chapter = new Chapter({
                    chapName: chapterName,
                    chapNumber: chapterNumber,
                    author: userId
                })
                await new_chapter.save();

                for (let index = 0; index < pageImagesBase64.length; index++) {
                    const new_panel = new Panel({
                        page: pageImagesBase64[index],
                        pageNo: index + 1,
                        author: userId
                    })
                    await new_panel.save();
                    new_chapter.pages.push(new_panel);
                }
                await new_chapter.save();

                const manga = await Manga.findById(mangaId);
                manga.chapters.push(new_chapter);
                await manga.save();
            });
            res.json({ msg: "ok" })
        }
    } catch (error) {
        res.json({ msg: "Server Error" })
    }
}))

//search mangas
router.post('/search', asyncHandler(async (req, res) => {

    try {
        const { search } = req.body;
        const mangas = await Manga.find({});
        const manga_titles = [];

        mangas.forEach(manga => {
            manga_titles.push(manga.title)
        });

        function calculateStringSimilarity(str1, str2) {
            const shorterLength = Math.min(str1.length, str2.length);
            let matchCount = 0;

            for (let i = 0; i < shorterLength; i++) {
                if (str1.charAt(i) === str2.charAt(i)) {
                    matchCount++;
                }
            }
            const matchPercentage = (matchCount / shorterLength) * 100;
            return matchPercentage;
        }

        function filterStringsBySimilarity(targetString, stringArray, similarityThreshold) {
            return stringArray.filter((str) => {
                const similarity = calculateStringSimilarity(targetString, str);
                return similarity >= similarityThreshold;
            });
        }

        const filtered_search = filterStringsBySimilarity(search, manga_titles, 50);

        let matched_searches = [];
        filtered_search.forEach(async (matched) => {
            const matched_manga = await Manga.findOne({ title: matched }).populate('author').populate('chapters')
            matched_searches.push(matched_manga)
        });

        setTimeout(() => {
            res.status(200).json(matched_searches)
        }, 50);
    } catch (error) {
        res.json({ msg: error })
    }

}))

router.post('/update', asyncHandler(async (req, res) => {
    const { newTitle, newDesc, status, mangaId, userId } = req.body;
    try {
        if (!newTitle || !newDesc || !status || !mangaId || !userId) {
            res.json({ msg: "Data incomplete" })
        }
        else {
            const current_manga = await Manga.findByIdAndUpdate(mangaId, {
                title: newTitle,
                desc: newDesc,
                status
            })
            await current_manga.save();
            res.json({ msg: "ok" })
        }
    } catch (error) {
        res.json({ msg: "Server Error" })
    }
}))

router.post('/chapters', asyncHandler(async (req, res) => {
    const { id, userId } = req.body;
    if (!id) {
        return res.json({ msg: "No Manga" })
    }
    try {
        const mangaContent = await Manga.findById(id).populate('chapters').populate('author').populate('genres').populate({ path: 'comments', populate: { path: 'author' } })
        res.json(mangaContent)
    } catch (error) {
        console.log(error)
        res.json({ msg: `Server Error ${error}` })
    }
}))

router.post('/rating', asyncHandler(async (req, res) => {
    const { id, selectedRating, userId } = req.body;
    if (!id || !selectedRating || !userId) {
        return res.json({ msg: "data incomplete" })
    }

    try {
        const manga = await Manga.findById(id);
        if (manga.rating == 0) {
            await Manga.findByIdAndUpdate(id, {
                rating: selectedRating
            },{new:true}).populate('chapters').populate('author').populate('genres').populate({ path: 'comments', populate: { path: 'author' } }).then(mangaContent=>{
                res.json(mangaContent)
            })
        } else {
            const newRating = ((manga.rating + selectedRating) / 2);
            await Manga.findByIdAndUpdate(id, {
                rating: newRating
            },{new : true}).populate('chapters').populate('author').populate('genres').populate({ path: 'comments', populate: { path: 'author' } }).then(mangaContent=>{
                res.json(mangaContent)
            })
        }
    } catch (error) {
        console.log(error)
        res.json({ msg: "Server error" })
    }
}))

router.post('/byuser', asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.json({ msg: "User not logged in" })
    }
    try {
        const user = await User.findById(id).populate('mangas');
        const mangasByUser = user.mangas;

        res.send(mangasByUser)
    } catch (error) {
        console.log(error);
        res.json({msg : "server error"})
    }
}))


module.exports = router