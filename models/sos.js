const mongoose=require('mongoose');
const sosSchema=new mongoose.Schema({
    email:{
        type:String,
        reuired:true
    },
    phone:{
        type:String,
        required:true
    },
    animalname:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    created:{
        type:Date,
        required:true,
        default:Date.now,
    },

});

module.exports=mongoose.model('Sos',sosSchema);