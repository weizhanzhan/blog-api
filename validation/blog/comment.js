const Validator = require('validator');
const isEmpty=require("../isEmpty")

module.exports=function validateComment(data){
    let error={};
    
    data.email=!isEmpty(data.email)?data.email:''
    data.content=!isEmpty(data.content)?data.content:''

    if(isEmpty(data.email)){
        error.email="邮箱不能为空"
    }
    if(!Validator.isEmail(data.email)){
        error.email="邮箱不合法"
    }
    if(Validator.isEmpty(data.content)){
        error.content="内容不能为空"
    }
    return{
        error,
        isValid:isEmpty(error)
    }
}