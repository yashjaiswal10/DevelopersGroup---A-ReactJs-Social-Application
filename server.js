 const express= require('express');
 const app= express();

 const cors = require('cors');
app.use(cors());

//  Body parser
 const bodyParser=require("body-parser");
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(bodyParser.json());


 const mongoose=require("mongoose");
 const db=require("./config/keys").mongoURI;

 const passport=require("passport");


const posts=require("./routes/api/posts")
const users=require("./routes/api/users")
const profile=require("./routes/api/profile")

 mongoose
 .connect(db)
 .then(()=>console.log("db connected"));

 app.get('/',(req,res)=>res.send("Hello"));
// passport middleware

// passport config
require('./config/passport')(passport);



 app.use("/api/users",users);
 app.use("/api/profile",profile);
 app.use("/api/posts",posts);

 const port=process.env.PORT||8000;

 app.listen(port,()=>console.log('server started on port '+port));

