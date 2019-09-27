const Validator = require('validator');
const isEmpty=require("../isEmpty")

module.exports=function validateCategory(data){
    let error={}; 
    data.name=!isEmpty(data.name)?data.name:''

    if(Validator.isEmpty(data.name)){
        error.name="分类名称不能为空"
    }
    return{
        error,
        isValid:isEmpty(error)
    }
}
