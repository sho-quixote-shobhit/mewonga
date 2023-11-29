const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler')
const axios = require('axios')

const Chapter = require('../models/chapter')
 
router.post('/getchapter' , asyncHandler(async(req,res)=>{
    const {chapId} = req.body;
    if(!chapId){
        return res.json({msg : "No"})
    }
    try {
        const chapter = await Chapter.findById(chapId).populate('pages');
        if(!chapter){
            return res.json({msg : "No"});
        }else{
            res.json(chapter)
        }
    } catch (error) {
        console.log(error);
        res.json({msg : "error occured" + error})
    }
}))


router.post('/colorize', asyncHandler(async(req, res) => {
    const { pages } = req.body;
    const pagesArray = [];

    pages.forEach(page => {
        pagesArray.push('data:image/jpeg;base64,' + page.page);
    });

    const coloredObj = await axios.post('http://127.0.0.1:8080/colorizeManga', { base64_strings: pagesArray }, { timeout: 120000 });

    const reversedProcessedImages = coloredObj.data.processed_images.reverse();

    console.log(reversedProcessedImages)

    res.send(reversedProcessedImages);
}));







module.exports = router