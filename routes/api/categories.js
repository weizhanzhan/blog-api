const express= require("express")
const router =express.Router()
const mongoose=require("mongoose")

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
    console.log(req.body)
    const {error,isValid }=validateCategory(req.body)
    if(!isValid){
        var data={msg:error,status:"error"}
        return res.json(data)
    }
    let category={}
    Category.findOne({name:req.body.name})
    .then(cate=>{
        if(cate){
            res.json({msg:"已经存在",status:0})
        }else{
            category.name=req.body.name
            category.imgUrl=req.body.img
           
            new Category(category).save()
            .then(cate=>{
                res.json({cate,status:100})
            })
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
router.post("/edit/:category_id",(req,res)=>{
    const {error,isValid }=validateCategory(req.body)
    if(!isValid){
        return res.status(400).json(error)
    }
    const newcategory={};
    newcategory.name=req.body.name;
    Category.findOneAndUpdate({_id:req.params.category_id},{$set:newcategory},
        {new:true}).then(cate=>{
            res.json(cate)
        })

})
module.exports=router