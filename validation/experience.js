const Validator = require('validator');
const isEmpty=require("./isEmpty")


module.exports=function validateExp(data){
    let error={};
    
    data.title=!isEmpty(data.title)?data.title:''
    data.company=!isEmpty(data.company)?data.company:''
    data.from=!isEmpty(data.from)?data.from:''

    if(Validator.isEmpty(data.title)){
        error.title="个人经历title不能为空"
    }
    if(Validator.isEmpty(data.company)){
        error.company="个人经历company不能为空"
    }
    if(Validator.isEmpty(data.from)){
        error.from="个人经历from不能为空"
    }


    return {
        error,
        isValid:isEmpty(error)
    }

}