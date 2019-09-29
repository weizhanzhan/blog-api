const express=require("express");
const mongoose=require("mongoose")
const app=express();
const bodyParser=require("body-parser")

// const multer = require('multer');
// const path = require('path');

const passport=require("passport");


//引入routes
const users=require('./routes/api/users')
const profile=require("./routes/api/profile")
const blog=require('./routes/api/blog')
const message=require('./routes/api/message')
const info=require('./routes/api/info')
const categories =require('./routes/api/categories')
//DB
const db=require('./config/keys').mongoURI
mongoose.connect(db, { useNewUrlParser: true })
           .then(res=>{
               console.log("mongodb is connected")
           })
           .catch(err=>{
               console.log(err)
           }) 

require("./config/passport")(passport)
//初始化passport
app.use(passport.initialize());

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,XPS-Version,Authorization,Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE");
    res.header("Access-Control-Allow-Methods","*");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8","text/html");   
    next();
});
const port =process.env.port ||5000;



//use body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use("/api",users)
app.use("/api",profile)
app.use("/api/blog",blog)
app.use("/api/message",message)
app.use("/api/info",info)
app.use("/api/categories",categories)

//图片上传
// app.use(express.static(path.join(__dirname, 'public')))

// var storage = multer.diskStorage({
//     destination: function (req, file, cb){
//         console.log(req,1)
//         cb(null, './public/images')
//     },
//     filename: function (req, file, cb){
//         console.log(req,2)
//         cb(null, file.originalname)
//     }
// });
// var upload = multer({ 
//     storage: storage 
// });
// app.post('/upload', upload.single('file'), function (req, res, next) {
//     console.log(req.body)
//     var url = 'http://' + req.headers.host + '/images/' + req.file.originalname
//     res.json({
//         code : 200,
//         data : url
//     })
// });

// app.listen(port,()=>{
//     console.log(`server is running at ${port}`)
// })
app.listen(process.env.PORT || 5000 , (req,res) => {
    // console.log(process)
    // const host = app.address().address
    // console.log("应用实例，访问地址为 http://%s:%s", host, port)
    console.log(`server is running at ${process.env.PORT || 5000 }`)
})