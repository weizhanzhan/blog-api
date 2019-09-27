const express= require("express")
const router =express.Router()
const mongoose=require("mongoose")
const Message =require('../../models/message')




router.get("/",(req,res)=>{
    let nowpage=parseInt(req.query.nowpage)
    let pagesize=parseInt(req.query.pagesize)
    if(nowpage<1){
        nowpage=1 
    }
    Message.count()
    .then(count=>{
        Message.find().sort({date:'desc'}).skip((nowpage-1)*pagesize).limit(pagesize).then(msg=>{
        
            res.json({msgs:msg,count})  
         })  
    }) 

})

const validateMessage=require("../../validation/message/addmessage")


//$route POST api/addmessage 
//@ 留言
// @access public
router.post("/addmessage",(req,res)=>{
    const {error,isValid }=validateMessage(req.body)
    if(!isValid){
        var data={msg:error,status:"error"}
        return res.json(data)
    }
    const newMessage={}

    newMessage.email=req.body.email
    newMessage.content=req.body.content
    new Message(newMessage).save()
    .then(msg=>{
        res.json({msg:{success:"留言成功"},status:"success",data:msg})
    })
   
})

//$route delete api/delmessage/:msg_id
//@ 删除留言
// @access public
router.delete("/delmessage/:msg_id",(req,res)=>{
    Message.findOneAndRemove({_id:req.params.msg_id})
    .then(()=>{
        res.json({msg:"删除成功"})
    })
   
})

//$route POST api/repmessage 
//@ 留言回复
// @access public
router.post("/repmessage",(req,res)=>{
    const {error,isValid }=validateMessage(req.body)
    if(!isValid){
        var data={msg:error,status:"error"}
        return res.json(data)
    }
    Message.findById(req.body._id)
    .then(msg=>{
        msg.replay.unshift({email:req.body.email,content:req.body.content})
        msg.save()
        .then(m=>{
            res.json({msg:"提交成功",status:"success"})
        })
    })
  
})
//$route GET api/addlike 
//@ 点赞
// @access public
router.get("/addlike/:comment_id",(req,res)=>{
    console.log(req.params.comment_id)
    Message.findById(req.params.comment_id)
    .then(msg=>{
        console.log(msg)
        msg.likes+=1
        msg.save()
        .then(newmsg=>{
            res.json({msg:{success:"点赞成功！"},status:"success"})
        })
    })
  
})
//$route GET api/adddislike 
//@ 不喜欢
// @access public
router.get("/adddislike/:comment_id",(req,res)=>{
    console.log(req.params.comment_id)
    Message.findById(req.params.comment_id)
    .then(msg=>{
        console.log(msg)
        msg.dislikes+=1
        msg.save()
        .then(newmsg=>{
            res.json({msg:{success:"不喜欢"},status:"success"})
        })
    })
  
})


module.exports=router