const express= require("express")
const router =express.Router()
const mongoose=require("mongoose")
const path=require('path');
const validateCategory=require("../../validation/category/category")
const Category =require('../../models/categories')
//$route GET api/categories
//@返回请求的json数据
// @access public
router.get("/",(req,res)=>{
    Category.find()
    .then(cate=>{
        res.json(cate)
    }) 

})

//$route POST api/categories/add
//@返回请求的json数据
// @access public
router.post("/add",(req,res)=>{
   
    const {error,isValid }=validateCategory(req.body)
    if(!isValid){
        var data={msg:error,status:"error"}
        return res.json(data)
    }
    let category={}
    Category.findOne({name:req.body.name})
    .then(async cate=>{
        if(cate){
            res.json({msg:"已经存在",status:0})
        }else{
           
            try {
                category.imgUrl = await handleBaseToImg(req.body.fileName,req.body.base)
                category.name=req.body.name
                new Category(category).save()
                .then(cate=>{
                    res.json({cate,status:1})
                })
            } catch (error) {
                res.status(400).json(error)
            }
        }           
    }) 
})

//$route delete api/categories/del/:category_id
//desc @ 删除分类
// @access public
router.delete("/del/:category_id",(req,res)=>{
 
    Category.findOneAndRemove({_id:req.params.category_id})
    .then(()=>{
        res.json({msg:"删除成功"})
    })

})

//$route POST api/categories/edit/:category_id
//@ 修改博客信息
// @access public
router.post("/edit/:category_id",async (req,res)=>{
    const {error,isValid }=validateCategory(req.body)
    if(!isValid){
        return res.status(400).json(error)
    }
    const newcategory={};
    newcategory.name=req.body.name;
    if(req.body.base){
        newcategory.imgUrl =  await handleBaseToImg(req.body.fileName,req.body.base)
    }else{
        newcategory.imgUrl = req.body.imgUrl
    }
  
    Category.findOneAndUpdate({_id:req.params.category_id},{$set:newcategory},
        {new:true}).then(cate=>{
            res.json(cate)
        })

})


//$route POST api/addblog 
//@ 将base64 转为图片
// @access public
router.post("/baseToImg",(req,res)=>{
   
    let data = req.body.url
    let oldname = req.body.name
    var fs = require('fs');
    var name =oldname
    var defpath = path.join(__dirname,'../../')
    // console.log('path:',defpath)
    // return res.json({msg:'success',url:'http://111.231.59.56/images/blog/'+name})
 　 var imgPath =defpath+"static\\images\\category/\\"+name  ;//从app.js级开始找--在我的项目工程里是这样的
   
    var base64 = data.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
    var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
    console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
    fs.writeFile(imgPath,dataBuffer,function(err){//用fs写入文件
        if(err){
            console.log(err);
        }else{
             return res.json({msg:'success',url:'http://111.231.59.56/blog/'+name})
        }
    })  
})

function handleBaseToImg(name,base){
    return new Promise((resolve,reject)=>{
        const defpath = path.join(__dirname,'../../')
        const fs = require('fs');
        const imgPath = defpath + "public\\images\\category/\\" + name  ;
        const base64 = base.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
        const dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
        console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(imgPath,dataBuffer,function(err){//用fs写入文件
            if(err){
                reject(err);
            }else{
                resolve('http://111.231.59.56:5000/images/category/'+name)
                //  return res.json({msg:'success',url:'http://111.231.59.56/images/blog/'+name})
            }
        })  
    })

}

module.exports=router