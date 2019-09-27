const express= require("express")
const router =express.Router()
const passport=require('passport')
const mongoose=require("mongoose")

const Profile=require("../../models/profile")
const User=require("../../models/user")

const validateProfile=require("../../validation/profile")
const validateExp=require("../../validation/experience")
const validateEdu=require("../../validation/education")
//$route GET api/profile
//@返回请求的json数据
// @access public
router.get("/test",(req,res)=>{
    res.json({
        msg:'success'
    })
})

//$route GET api/profile
//@返回请求的json数据  获取当前用户下的信息
// @access private
router.get("/profile",passport.authenticate("jwt",{session:false}),(req,res)=>{
    
    const error={}

    Profile.findOne({user:req.user.id}) 
    .populate('user',["name","avatar"]) //获取该用户下 与user表关联的 user信息
    .then(pro=>{
        if(!pro){
            console.log("come")
            error.profile="该用户信息不存在"
            return res.status(404).json(error)
        }
        res.json(pro)
    })
    .catch(err=>{res.status(404).json(err)})
})
//$route post api/profile
//desc @创建和编辑个人信息
// @access private
router.post("/profile",passport.authenticate("jwt",{session:false}),(req,res)=>{ 
    
    const {error,isValid }=validateProfile(req.body)
    if(!isValid){
        return res.status(400).json(error)
    }
    const profileFields={}
  
    profileFields.user=req.user.id
    if(req.body.handle){
        profileFields.handle=req.body.handle
    }
    if(req.body.company){
        profileFields.company=req.body.company
    }
    if(req.body.website){
        profileFields.website=req.body.website
    }
    if(req.body.handle){
        profileFields.handle=req.body.handle
    }
    if(req.body.location){
        profileFields.location=req.body.location
    }
    if(req.body.status){
        profileFields.status=req.body.status
    }
    if(req.body.bio){
        profileFields.bio=req.body.bio
    }
    if(req.body.githubusername){
        profileFields.githubusername=req.body.githubusername
    }

    //skills 数组转换
    if(typeof req.body.skills!=undefined){
        profileFields.skills=req.body.skills.split(",")
    }
    // social
    profileFields.social={}
    if(req.body.wechat){
        profileFields.social.wechat=req.body.wechat
    }
    if(req.body.QQ){
        profileFields.social.QQ=req.body.QQ
    }
    if(req.body.tengxunkt){
        profileFields.social.tengxunkt=req.body.tengxunkt
    }
    if(req.body.wangyikt){
        profileFields.social.wangyikt=req.body.wangyikt
    }

    Profile.findOne({user:req.user.id}).then(pro=>{
        if(pro){
            //用户信息存在,执行更新
            Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},
            {new:true}).then(pro=>{
                res.json(pro)
            })
        }
        else{
            //用户不存在 ，执行添加
            Profile.findOne({handle:profileFields.handle}).then(pro=>{
                if(pro){
                     error.handle="该用户个人信息已经存在，请勿重新创建"
                     return res.status(400).json(error)
                }
                new Profile(profileFields).save().then(pro=>res.json(pro))
            })
        }
    })
})

//$route GET api/profile/handle/:handle
//desc @ 根据handle 获取当前用户下的信息
// @access public
router.get("/profile/handle/:handle",(req,res)=>{
   const error={}
   profile.findOne({handle:req.params.handle})
   .populate('user',["name","avatar"]) //获取该用户下 与user表关联的 user信息
   .then(pro=>{
        if(!pro){
            error.noprofile="未找到该用户信息"
            return res.status(404).json(error)
        }
        res.json(pro)
   })
   .catch(err=>{ 
       res.status(404).json(err)
   })
})

//$route GET api/profile/user/:user_id
//desc @ 根据User_id 获取当前用户下的信息
// @access public
router.get("/profile/user/:user_id",(req,res)=>{
    const error={}
    profile.findOne({user:req.params.user_id})
    .populate('user',["name","avatar"]) //获取该用户下 与user表关联的 user信息
    .then(pro=>{
         if(!pro){
             error.noprofile="未找到该用户信息"
             return res.status(404).json(error)
         }
         res.json(pro)
    })
    .catch(err=>{ 
        res.status(404).json(err)
    })
 })

 //$route GET api/profile/all
//desc @ 根据User_id 获取当前用户下的信息
// @access public
router.get("/profile/all",(req,res)=>{
    const error={}
    profile.find()
    .populate('user',["name","avatar"]) //获取该用户下 与user表关联的 user信息
    .then(pros=>{
         if(!pros){
             error.noprofile="未找到任何用户信息"
             return res.status(404).json(error)
         }
         res.json(pros)
    })
    .catch(err=>{ 
        res.status(404).json(err)
    })
 })

//$route post api/profile/experience
//desc @添加个人经历
// @access private
router.post("/profile/experience",passport.authenticate("jwt",{session:false}),(req,res)=>{ 
    
    const {error,isValid }=validateExp(req.body)
    if(!isValid){
        return res.status(400).json(error)
    }

    Profile.findOne({user:req.user.id})
    .then(pro=>{ 
        const newExp={
            title:req.body.title,
            company:req.body.company,
            location:req.body.location,
            from:req.body.from,
            to:req.body.to,
            description:req.body.description,
            current:req.body.current,
        }
        console.log(pro,newExp)
        pro.experience.unshift(newExp)//unshift 放到最前面
        pro.save().then(pro=>{
            res.json(pro)
        })   
    }) 
})
//$route delete api/profile/experience/:exp_id
//desc @删除个人经历
// @access private
router.delete("/profile/experience/:exp_id",passport.authenticate("jwt",{session:false}),(req,res)=>{ 
    
    Profile.findOne({user:req.user.id})
    .then(pro=>{ 
        const removeIndex=pro.experience
        .map(item=>item.id)
        .indexOf(req.params.exp_id)    
        pro.experience.splice(removeIndex,1)
        pro.save().then(pro=>res.json(pro))
        .catch(err=>{res.status(404).json(err)})
    }) 
    
})

//$route post api/profile/education
//desc @添加个人教育学历
// @access private
router.post("/profile/education",passport.authenticate("jwt",{session:false}),(req,res)=>{ 
    
    const {error,isValid }=validateEdu(req.body)
    if(!isValid){
        return res.status(400).json(error)
    }

    Profile.findOne({user:req.user.id})
    .then(pro=>{ 
        const newEdu={
            school:req.body.school,
            degree:req.body.degree, //学历
            fieldofstudy:req.body.fieldofstudy,
            from:req.body.from,
            to:req.body.to,
            description:req.body.description,
            current:req.body.current,
        }
        pro.education.unshift(newEdu)//unshift 放到最前面
        pro.save().then(pro=>{
            res.json(pro)
        })    
    }) 
})
 
//$route delete api/profile/education/:edu_id
//desc @删除个人学历
// @access private
router.delete("/profile/education/:edu_id",passport.authenticate("jwt",{session:false}),(req,res)=>{ 
    
    Profile.findOne({user:req.user.id})
    .then(pro=>{ 
        const removeIndex=pro.education
        .map(item=>item.id)
        .indexOf(req.params.exp_id)    
        pro.education.splice(removeIndex,1)
        pro.save().then(pro=>res.json(pro))
       .catch(err=>{res.status(404).json(err)})
    }) 
    
})

//$route delete api/profile
//desc @删除整个用户
// @access private
router.delete("/profile",passport.authenticate("jwt",{session:false}),(req,res)=>{ 
    
    Profile.findOneAndRemove({user:req.user.id})
    .then(()=>{
        User.findOneAndRemove({_id:req.user.id})
        .then(()=>{
            res.json({msg:'删除成功'})
        })
    })
  
})
module.exports=router