const express = require("express");

const router=express.Router();

const auth=require("../../middleware/auth")

const User=require("../../models/User")

router.get("/",auth,
    async (req,res)=>{
      try{
         const data=await User.findById(req.user.id).select("-password")
         res.json({data})
      }catch(err){
          console.error(err.message)
          res.status(500).send("Server error")
      }
    // res.send("Auth route")
});

module.exports=router;