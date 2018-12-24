const express= require('express');
const router=express.Router();
 const mongoose=require("mongoose");
 const passport=require("passport");


// models
 const Post=require("../../models/Post")
 const Profile=require("../../models/Profile")


// load input validation 
const validatePostInput=require("../../validation/post");

router.get("/test",(req,res)=>res.json({msg:"posts works"}));


// get  api/posts  get posts   public
router.get("/",(req,res)=>{

Post.find()
.sort({date:-1})
.then(posts=>res.json(posts))
.catch(err=>res.status(404).json({nopostsfound:"No posts found"}));
 
});

// get  api/posts/:id    get posts by id   public
router.get("/:id",(req,res)=>{

    Post.findById(req.params.id)
    .then(post=>res.json(post))
    .catch(err=>res.status(404).json({nopostfound:"No post found"}));
    
    });
    




// post  api/posts  create post   private
router.post("/",passport.authenticate('jwt',{session:false}),(req,res)=>{

const{ errors,isValid}=validatePostInput(req.body);

// check validation


if(!isValid)
{  
    //   console.log(isValid);
    return res.status(400).json(errors);

}

    const newPost=new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        id:req.body.id,
        user:req.user.id

    });
    newPost.save().then(post=>res.json(post)); 

});



// delete  api/posts/:id    delete post by id   private
router.delete("/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
      .then(profile=>{
          Post.findById(req.params.id)
         
          .then(post=>{
            // console.log(post)
            //   check for post owner
            if(post.user.toString()!==req.user.id)
            {
                return res.status(401).json({notauthorised:"User not authorised"});
            }
           
            // delete
            post.remove().then(()=>res.json({success:true}));

          })
          .catch(err=> res.status(404).json({nopostfound:"No post found"}));
      })
    
    });
    
 

// like

// delete  api/posts/like/:id    like post      private
router.post("/like/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
      .then(profile=>{
          Post.findById(req.params.id)
         
          .then(post=>{
           if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
              return  res.status(400).json({alreadyliked:"User already liked this post"});
           }
           
        //    add userid to likes array
        post.likes.unshift({user:req.user.id});

        post.save().then(post=>res.json(post));

          })
          .catch(err=> res.status(404).json({nopostfound:"No post found"}));
      })
    
    });




// delete  api/posts/like/:id    like post      private
router.post("/unlike/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
      .then(profile=>{
          Post.findById(req.params.id)
         
          .then(post=>{
           if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
              return  res.status(400).json({notliked:"User have not yet liked this post"});
           }
           


        //    get remove index 
           const removeIndex=post.likes
           .map(item=>item.user.toString())
           .indexOf(req.user.id);


             //  splice out of array
             post.likes.splice(removeIndex,1);
             // save
             post.save().then(post=>res.json(post)); 

          })
          .catch(err=> res.status(404).json({nopostfound:"No post found"}));
      })
    
    });


    //  post  api/posts/comment/:id      add comment to post     private
    router.post("/comment/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{
        const{ errors,isValid}=validatePostInput(req.body);

// check validation


if(!isValid)
{  
    //   console.log(isValid);
    return res.status(400).json(errors);

}

    
        Post.findById(req.params.id)
         
        .then(post=>{

        const newComment=({
            text:req.body.text,
            name:req.body.name,
            avatar:req.body.avatar,
            user:req.user.id
    
        });
         //    add to comments  array
         post.comments.unshift(newComment);

         post.save().then(post=>res.json(post));
 
           })
           .catch(err=> res.status(404).json({nopostfound:"No post found"}));
    
    });
    


     // delete  api/posts/comment/:id/comment_id      delete comment to post     private
     router.delete(
        '/comment/:id/:comment_id',
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
          Post.findById(req.params.id)
            .then(post => {
              // Check to see if comment exists
              if (
                post.comments.filter(
                  comment => comment._id.toString() === req.params.comment_id
                ).length === 0
              ) {
                return res
                  .status(404)
                  .json({ commentnotexists: 'Comment does not exist' });
              }
      
              // Get remove index
              const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
      
              // Splice comment out of array
              post.comments.splice(removeIndex, 1);
      
              post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        }
      );
      


module.exports=router;