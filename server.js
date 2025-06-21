const express=require("express");

const connect=require("./config/db");

const app=express();

connect();

const port=process.env.PORT || 5000

app.listen(port,()=>console.log(`server is runnning on port ${port}`));

app.get("/",(req,res)=>res.send("API is running"));