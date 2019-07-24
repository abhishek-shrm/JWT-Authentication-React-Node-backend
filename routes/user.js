var express=require('express');
var router=express.Router();
var JWT =require('jsonwebtoken');
var brcyptjs=require('bcryptjs');
var User=require('../models/user');
var auth=require('../middlewares/auth');

//register
router.post('/register',(req,res)=>{

  User.findOne({username:req.body.username},(e,user)=>{ //e is for error
    if(e){
      console.log(e);
    }
    if(user){
      res.send({
        errors:'Username already exists!'
      });
    }
    if(!user){
      brcyptjs.hash(req.body.password,10,(err,hash)=>{
        if(err){
          console.log(err);
        }else{
          var userToRegister=new User({
            username:req.body.username,
            password:hash
          });
          userToRegister.save(error=>{
            if(error){
              console.log(err);
            }
            else{
              res.send({
                success:'You are registered successfully!!!'
              });
            }
          })
        }
      });
    }
  });
});

//login
router.post('/login',(req,res)=>{
  User.findOne({username:req.body.username},(e,user)=>{
    if(e){
      console.log(e);
    }
    if(!user){
      res.send({
        errors:'Invalid Username or Password!!'
      });
    }
    if(user){
      brcyptjs.compare(req.body.password,user.password,(err,result)=>{
        if(err){
          console.log(err);
        }
        if(!result){
          res.send({
            errors:'Invalid Username or Password!!'
          });
        }
        if(result){
          //generate token
          const token = JWT.sign({
            username:user.username
          },process.env.SECRET,{
            expiresIn:'1h'
          });
          //send token to front-end
          res.send({
            token:token,
            success:`Welcome ${user.username}, You are logged In`
          });
        }
      });
    }
  });
});

//data
router.get('/data',auth,(req,res)=>{
  res.send({
    data:'This is the auth protected data'
  });
});

module.exports=router;