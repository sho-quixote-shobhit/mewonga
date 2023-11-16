const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const axios = require('axios')

router.post('/animate',asyncHandler(async(req,res)=>{
    const face = req.body.croppedImage;
    const base64Data = face.split(',')[1];
    const animatedImage = await axios.post('http://127.0.0.1:8080/faceToComic', {face : base64Data} ,{withCredentials : true})
    res.json({animatedImage : animatedImage.data.comic})
}))


router.get('/create',asyncHandler(async(req,res)=>{
    const character = await axios.get('http://127.0.0.1:8080/generateAnimeFace');
   res.json({character : character.data.image_base64})
}))




module.exports = router