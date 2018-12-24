const express= require('express');
const app= express();
const path=require('path');
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

//  app.get('/',(req,res)=>res.send("Hello"));
// passport middleware

// passport config
require('./config/passport')(passport);



app.use("/api/users",users);
app.use("/api/profile",profile);
app.use("/api/posts",posts);

// Server static asset if in production
if(process.env.NODE_ENV==='production')
{
   app.use(express.static('client/build'));
   app.get('*',(req,res)=>{
       res.sendFile(path.resolve(__dirname,'client','build','index.html'));
   });
} 

const port=process.env.PORT||8000;

app.listen(port,()=>console.log('server started on port '+port));

