const express = require("express")
const router = express.Router()
const request = require('request')

router.get("/", (req, res) => {
    let code = req.query.code
    request({
        url:  'https://github.com/login/oauth/access_token?client_id=Iv1.bf8bf2cd9260e8a0&client_secret=a69f03e78b169ad05932e0161af802e7b6f83b66&code='+code,
        headers: {
            accept: 'application/json'
          },
        method: 'post',
        // form: requestData,
        json: true//设置返回的数据为json
        }, function(error, response, body) {
            res.json({
                msg:'success',
                data:body,
                code
            })
        }); 

    
  
})

module.exports=router