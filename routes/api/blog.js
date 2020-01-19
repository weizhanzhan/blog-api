const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const passport = require('passport')

const Blog = require('../../models/blog')
const Category = require('../../models/categories')
const validateBlog = require("../../validation/blog/addblog")
const validateCommemt = require("../../validation/blog/comment")
//$route GET api/profile
//@返回请求的json数据
// @access public 
router.get("/", (req, res) => {
  let nowpage = parseInt(req.query.nowpage)
  let pagesize = parseInt(req.query.pagesize)
  let isAbort = !!req.query.isAbort
  if (nowpage < 1) {
    nowpage = 1
  }
  console.log(isAbort);
  try {
    Blog.countDocuments({
      isAbort
    })
    .then(count => {

      Blog.find({
          isAbort
        })
        .populate('category') //populate 处理关联category字段的数据 ，这里括号的内容是这个表内的字段 不是关联表的名字
        .sort({
          date: 'desc'
        })
        .skip((nowpage - 1) * pagesize)
        .limit(pagesize)
        .then(all => {
          return res.json({
            blogs: all,
            count
          })
        })
    })
  } catch (error) {
    console.log(error);
  }
  

})

//$route POST api/addblog 
//@ 提交博客信息
// @access public
router.post("/addblog", (req, res) => {
  const {
    error,
    isValid
  } = validateBlog(req.body)
  if (!isValid) {
    var data = {
      msg: error,
      status: "error"
    }
    return res.json(data)
  } else {
    Blog.findOne({
        title: req.body.title
      })
      .then(blog => {
        if (blog) {
          error.title = "该标题文章已经存在"
          return res.json({
            msg: error,
            status: "error"
          })
        } else {
          const {
            author,
            categoryId,
            content,
            title
          } = req.body
          const newblog = {
            title,
            author,
            content,
            category: categoryId,
            isAbort: false
          };
          Blog.create(newblog)
            .then(blog => {
              Category.findById(categoryId)
                .then(cate => {
                  cate.count += 1
                  cate.save()
                })
              return res.json({
                msg: {
                  success: "博客提交成功"
                },
                status: "success",
                data: blog
              })
            })
            .catch(err => {
              return res.json({
                msg: err,
                status: "error"
              })
            })
        }
      })
  }
})

//$route POST api/addblog 
//@ 将base64 转为图片
// @access public
router.post("/basetoimg", (req, res) => {

  let data = req.body.url
  let oldname = req.body.name
  var fs = require('fs');
  var name = oldname
  var path = 'c:/nginx/html/images/blog/' + name; //从app.js级开始找--在我的项目工程里是这样的
  var base64 = data.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
  var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
  // console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
  fs.writeFile(path, dataBuffer, function (err) { //用fs写入文件
    if (err) {
      console.log(err);
    } else {
      return res.json({
        msg: 'success',
        url: 'http://111.231.59.56/images/blog/' + name
      })
    }
  })
})

//$route POST api/editblog/:blog_id
//@ 修改博客信息
// @access public
router.post("/editblog/:blog_id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  const {
    role
  } = req.user
  if (role !== 'superAdmin') {
    return res.status(400).json({
      msg: '作者写博客很辛苦，您就不要删除了，有时间可以查看作者的博客哦，github作者个人主页有地址'
    })
  }
  const {
    error,
    isValid
  } = validateBlog(req.body)
  if (!isValid) {
    return res.json(error)
  }
  const newblog = {};
  newblog.title = req.body.title;
  newblog.author = req.body.author;
  newblog.content = req.body.content
  Blog.findOneAndUpdate({
    _id: req.params.blog_id
  }, {
    $set: newblog
  }, {
    new: true
  }).then(pro => {
    return res.json(pro)
  })

})

//$route get api/getblog/:blog_id
//@ 根据id查询博客信息
// @access public
router.get("/getblog/:blog_id", (req, res) => {
  Blog.findById(req.params.blog_id)
    .then(blog => {
      return res.json(blog)
    })
})

//$route delete api/deleteblog
//desc @ 删除博客
// @access public
router.delete("/deleteblog/:blog_id", (req, res) => {

  const newblog = {};
  newblog.isAbort = true;
  Blog.findOneAndUpdate({
      _id: req.params.blog_id
    }, {
      $set: newblog
    }, {
      new: true
    })
    .then((blog) => {
      Category.findById(blog.category)
        .then(cate => {
          if (cate.count > 1) {
            cate.count--
          } else {
            cate.count = 0
          }
          cate.save()
        })
      return res.json({
        msg: "删除成功"
      })
    })
  // Blog.findOneAndRemove({_id:req.params.blog_id})
  // .then((blog)=>{
  //     Category.findById(blog.category)
  //     .then(cate=>{
  //         if(cate.count>1){
  //             cate.count --
  //         }else{
  //             cate.count = 0
  //         }
  //         cate.save()
  //     })
  //     return res.json({msg:"删除成功"})
  // })

})
//$route POST api/addcomment/:blog_id
//desc @ 提交博客评论
// @access public
router.post("/addcomment/:blog_id", (req, res) => {
  const {
    error,
    isValid
  } = validateCommemt(req.body)
  if (!isValid) {
    return res.json(error)
  }
  const newcomment = {};
  Blog.findOne({
      _id: req.params.blog_id
    })
    .then(blog => {
      if (!blog) {
        return res.json({
          msg: "该文章不见了"
        })
      } else {
        newcomment.content = req.body.content
        newcomment.email = req.body.email
        blog.comment.unshift(newcomment)
        blog.save().then(blog => {
          return res.json(blog)
        })
      }

    })
})
//$route GET api/addViewCount/:blog_id
//desc @ 增加博客view次数
// @access public
router.get("/addViewCount/:blog_id", (req, res) => {
  Blog.findById(req.params.blog_id)
    .then(blog => {
      blog.views += 1
      blog.save().then(blogs => {
        return res.json(blogs)
      })
    })
})
//$route GET api/addLikes/:blog_id
//desc @ 增加博客点赞次数
// @access public
router.get("/addLikes/:blog_id", (req, res) => {
  Blog.findById(req.params.blog_id)
    .then(blog => {
      blog.likes += 1
      blog.save().then(blogs => {
        return res.json(blogs)
      })
    })
})
//$route POST api/repcomment
//@ 评论回复
// @access public
router.post("/repcomment/:blog_id", (req, res) => {
  const {
    error,
    isValid
  } = validateCommemt(req.body)
  if (!isValid) {
    return res.json(error)
  }
  Blog.findById(req.params.blog_id)
    .then(blog => {
      blog.comment.find(com => {
        return com._id == req.body._id
      }).replay.unshift({
        email: req.body.email,
        content: req.body.content
      })
      blog.save()
        .then(m => {
          return res.json({
            msg: "提交成功",
            status: "success"
          })
        })
    })

})
//$route GET api/addlike 
//@ 点赞
// @access public
router.get("/addlike/:blog_id/:blog_comment_id", (req, res) => { //:blog_comment_id
  Blog.findById(req.params.blog_id)
    .then(blog => {
      blog.comment.find(b => {
        return b._id == req.params.blog_comment_id
      }).likes += 1
      blog.save().then(() => {
        return res.json({
          msg: {
            success: "点赞成功！"
          },
          status: "success"
        })
      })
    })


})
//$route GET api/adddislike 
//@ 不喜欢
// @access public
router.get("/adddislike/:blog_id/:blog_comment_id", (req, res) => { //:blog_comment_id
  Blog.findById(req.params.blog_id)
    .then(blog => {
      blog.comment.find(b => {
        return b._id == req.params.blog_comment_id
      }).dislikes += 1
      blog.save().then(() => {
        return res.json({
          msg: {
            success: "不喜欢！"
          },
          status: "success"
        })
      })
    })


})

//$route get api/nextblog/:blog_id
//@ 根据id查询下一个博客
// @access public
router.get("/nextblog/:blog_id", (req, res) => {

  Blog.find({
      '_id': {
        '$lt': req.params.blog_id
      }
    }).sort({
      _id: -1
    }).limit(1)
    .then(blog => {
      if (blog.length == 0) {
        res.json({
          err: true
        })
      }
      res.json(blog)
    })

})
//$route get api/upblog/:blog_id
//@ 根据id查询下一个博客
// @access public
router.get("/upblog/:blog_id", (req, res) => {

  Blog.find({
      '_id': {
        '$gt': req.params.blog_id
      }
    }).sort({
      _id: 1
    }).limit(1)
    .then(blog => {
      if (blog.length == 0) {
        res.json({
          err: true
        })
      }
      res.json(blog)
    })

})
//$route get api/blog/:category
//@ 根据分类获取所有博客
// @access public
router.get("/:category", (req, res) => {
  let nowpage = parseInt(req.query.nowpage)
  let pagesize = parseInt(req.query.pagesize)
  if (nowpage < 1) {
    nowpage = 1
  }
  Blog.countDocuments({
      classify: req.params.category
    })
    .then(count => {
      Blog.find({
          classify: req.params.category
        }).sort({
          date: 'desc'
        }).skip((nowpage - 1) * pagesize).limit(pagesize)
        .then(blogs => {
          res.json({
            blogs,
            count
          })
        })
    })


})
module.exports = router