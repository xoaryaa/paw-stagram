const mongoose = require("mongoose");
const userSchema= new mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    confirmpassword:{
        type:String,
        require:true
    }
});


// create Collection 

const Users= new mongoose.model("Users",userSchema);

module.exports = Users;