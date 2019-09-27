const mongoose =require("mongoose")
const Schema =mongoose.Schema;

// create user model
const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    avatar:{
        type:String,
    
    },
    date:{
        type:Date,
        default:Date.now
    },
})
module.exports=user=mongoose.model("users",userSchema)