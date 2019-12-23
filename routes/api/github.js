const express = require("express")
const router = express.Router()
const request = require('request')

router.get("/", (req, res) => {
    let code = req.query.code
    request({
        url:  'https://github.com/login/oauth/access_token?client_id=a3cca693df0ee3a00cb9&client_secret=7b82d8e39f140637b742c1fbc1cc87bd7e21c5bc&code='+code,
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