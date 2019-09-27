const Validator = require('validator');
const isEmpty=require("./isEmpty")


module.exports=function validateRegister(data){
    let error={};
    
    data.name=!isEmpty(data.name)?data.name:''
    data.email=!isEmpty(data.email)?data.email:''
    data.password=!isEmpty(data.password)?data.password:''
    data.password2=!isEmpty(data.password2)?data.password2:''

    if(!Validator.isLength(data.name,{min:2,max:30})){
        error.nameA="名字不符合"
    }
    if(Validator.isEmpty(data.name)){
        error.nameB="名字不能为空"
    }
    if(Validator.isEmpty(data.email)){
        error.emailA="邮箱不能为空"
    }
    if(!Validator.isEmail(data.email)){
        error.emailB="邮箱不合法"
    }
    if(Validator.isEmpty(data.password)){
        error.passwordA="密码不能为空"
    }
    if(!Validator.isLength(data.password,{min:5,max:30})){
        error.passwordB="密码不符合"
    }
    if(Validator.isEmpty(data.password2)){
        error.password2A="确认密码不能为空"
    }
    if(!Validator.equals(data.password,data.password2)){
        error.password2B="两次密码输入不一致"
    }
    console.log(error,isEmpty(error))
    return {
        error,
        isValid:isEmpty(error)
    }

}