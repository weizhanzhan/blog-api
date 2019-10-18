//处理百度api识别表格
const express= require("express")
const router =express.Router()
var qs = require('querystring');
var request = require('request')


const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'phi19goPZKLfLM0Nij1EQsqO',
    'client_secret': 'yecqsGlc0HRCQRMUGVGx9wiGe5xZNBYe'
    // 'client_id': 'nPXH0af66d21uNveHVuPGHSH',wode
    // 'client_secret': 'iLUpXF7g6jHkzUXPt8e9XNZwKxfr7VZo'
});

function getToken(img,callback){
    request('https://aip.baidubce.com/oauth/2.0/token?' + param, function (error, response, body) {
        var res= JSON.parse(body)
        toExcel(res.access_token,img,callback)
    });
}


function toExcel(access_token,img,callback){
    var requestData = {
        'image':img.substr(23),
        'is_sync':'true',
        'request_type':'excel',
    }
    request({
        url: 'https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/request?access_token=' +access_token,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        form: requestData,
        json: true//设置返回的数据为json
        }, function(error, response, body) {
            callback(body)
        }); 
    }
//$route POST api/addblog 
//@ 提交博客信息
// @access public
router.post("/toExcel",(req,res)=>{
 
   const { img } = req.body
  console.log(1);
   if(!img) {
    res.json({state:0,msg:'图片信息错误！'})
   }
   console.log(1);
   getToken(img,(data)=>{
    res.json({state:data})
   })
 
})

module.exports=router