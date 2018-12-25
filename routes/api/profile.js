const express= require('express');
const router=express.Router();
const mongoose=require("mongoose");
const passport=require("passport");

// load  validation
const validateProfileInput=require("../../validation/profile");
const validateExperienceInput=require("../../validation/experience");
const validateEducationInput=require("../../validation/education");




// models
const User=require("../../models/User")
const Profile=require("../../models/Profile")


router.get("/test",(req,res)=>res.send({msg:"profile works"}));

// GET api/profile   get current profile   private access
router.get("/",passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={};

    Profile.findOne({user:req.user.id})
     .populate("user",["name","avatar"])    
    .then(profile=>{
               if(!profile){
               errors.noprofile="No profile found";
               return res.status(404).json(errors);
               }
               res.json(profile);
           })

           .catch(err=> res.status(404).json(err));
})


// GET api/profile/all   get all profiles   public access
router.get('/all',(req,res)=>{
    const errors={};

   
    Profile.find()
     .populate("user",["name","avatar"])    
    .then(profiles=>{
               if(!profiles){
               errors.noprofile="There are no profiles";
               return res.status(404).json(errors);
               }

               res.json(profiles);
            })
            .catch(err=> res.status(404).json({profile:"There are no profiles"}));

        });





// GET api/profile/handle/:handle   get profile by handle   public access

router.get("/handle/:handle",(req,res)=>{
    const errors={};

    Profile.findOne({handle:req.params.handle})
     .populate("user",["name","avatar"])    
    .then(profile=>{
               if(!profile){
               errors.noprofile="No profile found";
               return res.status(404).json(errors);
               }

               res.json(profile);
            })
            .catch(err=> res.status(404).json({profile:"No profile exists"}));
        });



// GET api/profile/user/:user_id   get profile by user_id   public access

router.get("/user/:user_id",(req,res)=>{
    const errors={};

    Profile.findOne({user:req.params.user_id})
     .populate("user",["name","avatar"])    
    .then(profile=>{
               if(!profile){
               errors.noprofile="No profile found";
               return res.status(404).json(errors);
               }

               res.json(profile);
            })
            .catch(err=> res.status(404).json({profile:"No profile exists"}));
        });





// POST api/profile   create or edit user profile   private access
router.post("/",passport.authenticate('jwt',{session:false}),(req,res)=>{

    const{ errors,isValid}=validateProfileInput(req.body);


// check validation

if(!isValid)
{  
    //   console.log(isValid);
    return res.status(400).json(errors);

}

    
//    GET fields
const profileFields={};
profileFields.user=req.user.id;
if(req.body.handle)profileFields.handle=req.body.handle;
if(req.body.company)profileFields.company=req.body.company;
if(req.body.website)profileFields.website=req.body.website;
if(req.body.location)profileFields.location=req.body.location;
if(req.body.bio)profileFields.bio=req.body.bio;
if(req.body.status)profileFields.status=req.body.status;
if(req.body.githubusername)profileFields.githubusername=req.body.githubusername;
// skills split into array
if(typeof req.body.skills!=='undefined')
 {
    profileFields.skills=req.body.skills.split(',');
}
// social
profileFields.social={};

if(req.body.youtube)profileFields.social.youtube=req.body.youtube;
if(req.body.facebook)profileFields.social.facebook=req.body.facebook;
if(req.body.instagram)profileFields.social.instagram=req.body.instagram;
if(req.body.twitter)profileFields.social.twitter=req.body.twitter;
if(req.body.linkedin)profileFields.social.linkedin=req.body.linkedin;

Profile.findOne({user:req.user.id})
           .then(profile=>{
               if(profile){
                //update
               Profile.findOneAndUpdate(
                   {user:req.user.id},
                   {$set:profileFields},
                   {new:true}
                   )
                   .then(profile=>res.json(profile));
              
               }
               else{
                //    create

                  //check if handle exist
                  Profile.findOne({handle:req.body.handle}) 
                          .then(profile=>{
                              if(profile)
                              {
                                  errors.handle="that handle exist already";
                                  res.status(400).json(errors);
                              }

                            //   save profile
                            new Profile(profileFields).save()
                                    .then(profile=>res.json(profile))
                                    .catch(err=>console.log(err));
                          })


               }
           })


})






// POST api/profile/experience  add experience to profile  private access

router.post("/experience",passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    const{ errors,isValid}=validateExperienceInput(req.body);


// check validation

if(!isValid)
{  
    //   console.log(isValid);
    return res.status(400).json(errors);

}


    Profile.findOne({user:req.user.id})
    //  .populate("user",["name","avatar"])    
    
    .then(profile=>{
        // console.log(req.user.id)
               const newExp={
                   title:req.body.title,
                   company:req.body.company,
                   location:req.body.location,
                   from:req.body.from,
                   to:req.body.to,
                   current:req.body.current,
                   description:req.body.description
               }
           
            //    add to experience array
            profile.experience.unshift(newExp);
                // console.log(newExp);
            profile.save().then(profile=>res.json(profile)); 

            })
            .catch(err=> res.status(404).json({profile:"No profile exists"}));
        });






  // POST api/profile/education    add education to profile     private access

router.post("/education",passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    const{ errors,isValid}=validateEducationInput(req.body);


// check validation

if(!isValid)
{  
    //   console.log(isValid);
    return res.status(400).json(errors);

}


    Profile.findOne({user:req.user.id})
    //  .populate("user",["name","avatar"])    
    
    .then(profile=>{
        // console.log(req.user.id)
               const newEdu={
                   school:req.body.school,
                   degree:req.body.degree,
                   fieldofstudy:req.body.fieldofstudy,
                   from:req.body.from,
                   to:req.body.to,
                   current:req.body.current,
                   description:req.body.description
               }
           
            //    add to education array at first
            profile.education.unshift(newEdu);
               
            profile.save().then(profile=>res.json(profile)); 

            })
            .catch(err=> res.status(404).json({profile:"No profile exists"}));
        });



// DELETE api/profile/experience/:exp_id    delete experience from profile     private access

router.delete("/experience/:exp_id",passport.authenticate('jwt',{session:false}),(req,res)=>{
    

    Profile.findOne({user:req.user.id})
    //  .populate("user",["name","avatar"])    
    
    .then(profile=>{
       
        // get remove index
        const removeIndex=profile.experience
             .map(item=>item.id)
             .indexOf(req.params.exp_id);
             
            //  splice out of array
            profile.experience.splice(removeIndex,1);
            // 
            profile.save().then(profile=>res.json(profile)); 
            })
            .catch(err=> res.status(404).json({profile:"No profile exists"}));
        });



        // DELETE api/profile/education/:edu_id    delete education from profile     private access

router.delete("/education/:edu_id",passport.authenticate('jwt',{session:false}),(req,res)=>{
    

    Profile.findOne({user:req.user.id})
    //  .populate("user",["name","avatar"])    
    
    .then(profile=>{
       
        // get remove index
        const removeIndex=profile.education
             .map(item=>item.id)
             .indexOf(req.params.edu_id);
             
            //  splice out of array
            profile.education.splice(removeIndex,1);
            // 
            profile.save().then(profile=>res.json(profile)); 
            })
            .catch(err=> res.status(404).json({profile:"No profile exists"}));
        });



           // DELETE api/profile   delete  user and profile     private access

router.delete("/",passport.authenticate('jwt',{session:false}),(req,res)=>{
    

    Profile.findOneAndRemove({user:req.user.id})
    //  .populate("user",["name","avatar"])    
         .then(()=>{
             User.findOneAndRemove({_id:req.user.id})
               .then(()=>
               res.json({success:true})

               )
         })
             
            
        });




module.exports=router;