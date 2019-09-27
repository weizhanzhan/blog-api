const Validator = require('validator');
const isEmpty=require("./isEmpty")


module.exports=function validateProfile(data){
    let error={};
    
    data.handle=!isEmpty(data.handle)?data.handle:''
    data.status=!isEmpty(data.status)?data.status:''
    data.skills=!isEmpty(data.skills)?data.skills:''


    if(!Validator.isLength(data.handle,{min:2,max:40})){
        error.handleA="用户名的长度不能少于2位"
    }

    if(Validator.isEmpty(data.handle)){
        error.handleB="用户名不能为空"
    }
    if(Validator.isEmpty(data.status)){
        error.status="职位不能为空"
    }
    if(Validator.isEmpty(data.skills)){
        error.skills="技能不能为空"
    }
   
    if(!isEmpty(data.website)){     
        if(!Validator.isURL(data.website)){
            error.website="website不合法"
        }
    }
    if(!isEmpty(data.tengxunkt)){     
        if(!Validator.isURL(data.tengxunkt)){
            error.tengxunkt="tengxunkt不合法"
        }
    }
    if(!isEmpty(data.wangyikt)){     
        if(!Validator.isURL(data.wangyikt)){
            error.wangyikt="wangyikt不合法"
        }
    }

    return {
        error,
        isValid:isEmpty(error)
    }

}