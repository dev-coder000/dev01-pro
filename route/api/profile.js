const express = require("express");

const router=express.Router();

const auth= require("../../middleware/auth")



const user=require("../../models/User")

const {check,validationResult}=require("express-validator");
const Profile = require("../../models/Profile");
const { profile } = require("node:console");

router.get("/me",auth,async(req,res)=>{
    // res.send("Profile route")
      try{
         const prof=await Profile.findOne({user:req.user.id}).populate("user",['name',"avatar"])
         if(prof){
            res.status(200).json({msg:"Profile found"})
         }else{
            res.status(200).json({msg:"Profile does not exists"})
         }
      }catch(err){
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
      }
    });
router.post("/",auth,[
  check("status","status is required").notEmpty(),
  check("skills","skills are required").notEmpty()
],
async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
       res.status(300).json({error:errors.array()})
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        skills,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    }=req.body
    let profileFeilds={}
    profileFeilds.user=req.user.id
    if(company) profileFeilds.company=company
    if(website) profileFeilds.website=website
    if(location) profileFeilds.location=location
    if(bio) profileFeilds.bio=bio
    if(status) profileFeilds.status=status
    if(skills) profileFeilds.skills=skills.split(",").map(skills=>skills.trim())
    if(githubusername) profileFeilds.githubusername=githubusername

     profileFeilds.social={}
     if(youtube) profileFeilds.social.youtube=youtube
     if(twitter) profileFeilds.social.twitter=twitter
     if(facebook) profileFeilds.social.facebook=facebook
     if(linkedin) profileFeilds.social.linkedin=linkedin
     if(instagram) profileFeilds.social.instagram=instagram

     try{
        let prof=await Profile.findOne({user:req.user.id})
        // console.log(prof)
        if(prof){
            prof=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFeilds},{new:true})
            
            return res.json({prof})
        }
        prof=new Profile(profileFeilds)
        await prof.save()
        return res.json({prof})
     }catch(err){
        console.error(err.message)
        res.status(500).send("Server error")
     }
})
module.exports=router;