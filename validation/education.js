const Validator = require('validator');
const isEmpty=require("./isEmpty")


module.exports=function validateEdu(data){
    let error={};
    
    data.school=!isEmpty(data.school)?data.school:''
    data.degree=!isEmpty(data.degree)?data.degree:''
    data.fieldofstudy=!isEmpty(data.fieldofstudy)?data.fieldofstudy:''
    data.from=!isEmpty(data.from)?data.from:''

    if(Validator.isEmpty(data.school)){
        error.school="个人学历school不能为空"
    }
    if(Validator.isEmpty(data.degree)){
        error.degree="个人学历degree不能为空"
    }
    if(Validator.isEmpty(data.fieldofstudy)){
        error.fieldofstudy="个人学历专业不能为空"
    }
    if(Validator.isEmpty(data.from)){
        error.from="个人学历from不能为空"
    }


    return {
        error,
        isValid:isEmpty(error)
    }

}