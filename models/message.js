const mongoose =require("mongoose")
const Schema =mongoose.Schema;

const messageSchema=new Schema({

    email:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    replay:[
        {
            content:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    img:{
        type:String,
        default:"http://111.231.59.56:5000/images/vue.png"
    },
    date:{
        type:Date,
        default:Date.now
    },

})
module.exports=message=mongoose.model("message",messageSchema)