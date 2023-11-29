const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const axios = require('axios')

const Comment = require('../models/comment')
const Manga = require('../models/manga')

router.post('/animate', asyncHandler(async (req, res) => {
    const face = req.body.croppedImage;
    const base64Data = face.split(',')[1];
    const animatedImage = await axios.post('http://127.0.0.1:8080/faceToComic', { face: base64Data }, { withCredentials: true })
    res.json({ animatedImage: animatedImage.data.comic })
}))


router.get('/create', asyncHandler(async (req, res) => {
    const character = await axios.get('http://127.0.0.1:8080/generateAnimeFace');
    res.json({ character: character.data.image_base64 })
}))

router.post('/comment', asyncHandler(async (req, res) => {
    const { userId, newcomment, id } = req.body;
    if (!userId || !newcomment || !id) {
        return res.json({ msg: "Data incomplete" })
    }

    try {
        const status_obj = await axios.post('http://127.0.0.1:8080/commentSentiment', { comment: newcomment }, { withCredentials: true })
        const status = status_obj.data.value
        const new_comment = new Comment({
            comment: newcomment,
            status,
            author: userId
        })
        await new_comment.save();
        const manga = await Manga.findById(id);
        manga.comments.push(new_comment);
        await manga.save();
        res.json(new_comment);
    } catch (error) {
        console.log(error)
        res.json({ msg: "server error" })
    }
}))

router.post('/deletecomment', asyncHandler(async (req, res) => {
    const { id, commentId } = req.body;

    if (!id || !commentId) {
        return res.json({ msg: "Data incomplete!!" })
    }
    try {
        const updated_manga = await Manga.findByIdAndUpdate(id, { $pull: { comments: commentId } })
        await updated_manga.save()
        await Comment.deleteOne({ _id: commentId });
        res.json({ msg: "ok" })
    } catch (error) {
        console.log(error)
        res.json({ msg: "server error" + error })
    }

}))


router.get('/topmanga', asyncHandler(async (req, res) => {
    try {
        const allManga = await Manga.find({});
        const sortedManga = allManga.sort((a, b) => b.rating - a.rating);
        const top5Manga = sortedManga.slice(0, 5);
        res.send(top5Manga)
    } catch (error) {
        res.json({msg : "Server error"})
    }
}))

module.exports = router