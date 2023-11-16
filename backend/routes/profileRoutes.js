const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const User = require('../models/user')

router.put('/edit' , asyncHandler(async(req,res,next)=>{
    const {userId , newUsername , newDp} = req.body;

    if(!newUsername || !userId){
        res.json({msg : "Invalid credentials"})
    }else{
        try {
            if(newDp){
                const user = await User.findByIdAndUpdate(userId , {
                    username : newUsername,
                    dp : newDp
                });
                await user.save();
                res.json(user)
            }else{
                const user = await User.findByIdAndUpdate(userId , {
                    username : newUsername,
                });
                await user.save();
                res.json(user)
            }
        } catch (error) {
            console.log(error)
        }
    }
}))



module.exports = router