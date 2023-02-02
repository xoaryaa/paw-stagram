// imports


require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const session=require("express-session");
const bcrypt=require('bcrypt');


const app=express();
const PORT=process.env.PORT|| 5000;


mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true});
const db=mongoose.connection;
db.on("error",(error)=> console.log(error));
db.once("open",()=>console.log("CONNECTED TO THE DATABASE"));



app.use(express.urlencoded({extended:false}));
app.use(express.json());
// app.use(express.static(__dirname + '/public'));



app.use(session({
    secret:'my secret key',
    saveUninitialized:true,
    resave:false
}));

app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
});



app.use(express.static('uploads'));


app.set('view engine','ejs');
app.use("",require("./routes/routes"));

app.get('/pawstagram', (req,res)=>{
    res.render("index")
})

// app.use("",require.resolve("./routes/routes"));



app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});