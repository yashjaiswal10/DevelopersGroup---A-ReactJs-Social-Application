const express= require('express');
const router=express.Router();
const gravatar=require("gravatar");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const keys =require("../../config/keys");
const passport=require("passport");



// load input validation
const validateRegisterInput=require("../../validation/register");
const validateLoginInput=require("../../validation/login");


const User=require("../../models/User")


router.get("/test",(req,res)=>res.json({msg:"users works"}));


router.post("/register",(req,res)=>{

const{ errors,isValid}=validateRegisterInput(req.body);

// check validation


if(!isValid)
{  
    //   console.log(isValid);
    return res.status(400).json(errors);

}

console.log(req.body.email);

    User.findOne({email:req.body.email})
        .then(user=>{
            if(user)
            {
                errors.email="email already exists";
                return res.status(400).json({errors});
            }
            else{
                
                 const avatar=gravatar.url(req.body.email,{
                     s:"200",
                     r:"pg",
                     d:"mm"
                 });


                const newUser=new User(
                    {
                      name:req.body.name,
                      email:req.body.email,
                      avatar:avatar,
                      password:req.body.password

                    });


                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err;
                            newUser.password=hash;
                            newUser.save()
                                   .then(user=>res.json(user))
                                   .catch(err=>console.log(err));

                        })
                    })
                    
                    // return res.status(400).json("newUser");
                    
            }
        })

});



router.post("/login",(req,res)=>{

    const{ errors,isValid}=validateLoginInput(req.body);

    // check validation
    
    
    if(!isValid)
    {    
        // console.log(isValid);
    
        return res.status(400).json(errors);
    
    }



    const email=req.body.email;
    const password=req.body.password;

    
    User.findOne({email})
         .then(user=>{
             // check for user
             if(!user)
             {
                 errors.email="User not found";
                return res.status(404).json(errors);
 
             }
            //  comapare password
            bcrypt.compare(password,user.password)
                  .then(isMatch=>
                    {
                        if(isMatch)
                        {
                    //    User Matched
                    // JWT payload
                       const payload={id:user.id,name:user.name,avatar:user.avatar};


                    // sign token
                    jwt.sign(payload,keys.secretOrKey,{expiresIn:7200},(err,token)=>{
                        res.json({success:true,token:'Bearer '+token});
                    });
                }
                        else{
                            errors.password="password incorrect"
                            return res.status(400).json(errors); 
                        }
                    })

         })
})



// current user -private 
router.get("/current",passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({id:req.user.id,name:req.user.name,email:req.user.email});
})




module.exports=router;