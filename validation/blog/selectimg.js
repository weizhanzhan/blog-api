const mongoose=require("mongoose")

const Category =require('../../models/categories')
module.exports=async function(data){
     let urls=[]
     await Category.find()
             .then(cate=>{
                urls=cate
             })
     return urls.find(url=>{
         return url.name==data
     })
    // switch(data){
    //     case 'Vue.js':
    //        return 'http://111.231.59.56:5000/images/classify/vue.png';
    //        break;
    //     case 'React.js':
           
    // }
        
}