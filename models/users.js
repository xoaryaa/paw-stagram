const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        reuired:true
    },
    email:{
        type:String,
        required:true
    },
    caption:{
        type:String,
    },
    image:{
        type:String,
        // required:true,
    },
    created:{
        type:Date,
        required:true,
        default:Date.now,
    },

});

module.exports=mongoose.model('User',userSchema);