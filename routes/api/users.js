const express= require("express")
const router =express.Router()
const keys=require("../../config/keys")
//密码加密
const bcrypt=require('bcrypt')
const gravatar = require('gravatar');
//token
const jwt = require('jsonwebtoken');
const passport=require('passport')

//引入验证
const validateRegister=require("../../validation/register")
const validateLogin=require("../../validation/login")

const User =require("../../models/user")
//$route GET api/users
//@返回请求的json数据
// @access public
router.get("/users",(req,res)=>{
    User.find().then(users=>{
        res.json(users)
    })

})

//$route Post api/users/register
//@返回请求的json数据
// @access public  request 
router.post("/users/register",(req,res)=>{
    const {error,isValid} = validateRegister(req.body) 
    if(!isValid){
        return res.status(400).json(error)
    }
    //查询数据库中是否有邮箱
    console.log(req.body)
    User.findOne({
        email:req.body.email
    }).then(user=>{
        if(user){
            return res.status(400).json({msg:'邮箱已被注册'})
        }else{
            const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const newUser=new User({
                name:req.body.name,
                email:req.body.email,
                role:req.body.role,
                avatar,
                password:req.body.password
            })
            bcrypt.genSalt(10, function(err, salt) {//密码加密
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if(err) throw err;
                    newUser.password=hash
                    newUser.save()
                    .then(user=>res.json(user))
                    .catch(err=>console.log(err))
                });
            });
        }
    })
})
//$route Post api/users/login
//@返回token jwt passport
// @access public
router.post("/users/login",(req,res)=>{
        const {error,isValid} = validateLogin(req.body)
        if(!isValid){
            return res.status(400).json(error)
        }

       const email=req.body.email;
       const password=req.body.password
       User.findOne({email})
           .then(user=>{
               if(!user){
                   return res.status(404).json({msg:'用户不存在'})
               }else{
                   //bcrypt 密码解析匹配
                   bcrypt.compare(password,user.password)
                   .then((isMatch)=>{
                       if(isMatch){
                           const rule={id:user.id,name:user.name}
                           jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                             if(err) throw err
                             res.json({msg:"登录成功",token:"Bearer "+token})
                           })
                       }else{
                           return res.status(400).json({msg:'密码错误'})
                       }

                   })
               }
           })
})
//$route GET api/users/current
//return current user
// @access private
// router.get("./current","验证token",(req,res)=>{
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
	role:req.user.role,
	avatar:req.user.avatar
    })
})
module.exports=router