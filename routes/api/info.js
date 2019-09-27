const express= require("express")
const router =express.Router()
const mongoose=require("mongoose")


//$route GET api/info
//@返回请求的json数据
// @access public
router.get('/',(req,res)=>{
    res.json({msg:'success'})
})


module.exports=router