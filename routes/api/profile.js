const express= require('express');
const router=express.Router();

router.get("/test",(req,res)=>res.send({msg:"profile works"}));
module.exports=router;