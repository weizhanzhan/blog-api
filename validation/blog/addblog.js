const Validator = require('validator');
const isEmpty=require("../isEmpty")

module.exports=function validateBlog(data){
    let error={};
    
    data.title=!isEmpty(data.title)?data.title:''
    data.author=!isEmpty(data.author)?data.author:''
    data.content=!isEmpty(data.content)?data.content:''

    if(Validator.isEmpty(data.title)){
        error.title="标题不能为空"
    }
    if(Validator.isEmpty(data.author)){
        error.author="作者不能为空"
    }
    if(Validator.isEmpty(data.content)){
        error.content="内容不能为空"
    }
    return{
        error,
        isValid:isEmpty(error)
    }
}
