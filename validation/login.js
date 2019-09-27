const Validator = require('validator');
const isEmpty=require("./isEmpty")


module.exports=function validateLogin(data){
    let error={};
    
    data.email=!isEmpty(data.email)?data.email:''
    data.password=!isEmpty(data.password)?data.password:''


    if(Validator.isEmpty(data.email)){
        error.email="邮箱不能为空"
    }
    if(!Validator.isEmail(data.email)){
        error.email="邮箱不合法"
    }
    if(Validator.isEmpty(data.password)){
        error.password="密码不能为空"
    }

    return {
        error,
        isValid:isEmpty(error)
    }

}