 const express= require('express');
 const app= express();

 const mongoose=require("mongoose");
 const db=require("./config/keys").mongoURI;

const posts=require("./routes/api/posts")
const users=require("./routes/api/users")
const profile=require("./routes/api/profile")

 mongoose
 .connect(db)
 .then(()=>console.log("db connected"));

 app.get('/',(req,res)=>res.send("Hello"));

//  app.use("/api/users",users);
 app.use("/api/profile",profile);
 app.use("/api/posts",posts);

 const port=process.env.PORT||1500;

 app.listen(port,()=>console.log('server started on port '+port));

