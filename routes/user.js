const User=require('../models/user');
const express = require('express');
const authenticationMiddleware=require('../middlewares/authentication');
const validationMiddleWare = require('../middlewares/validationMiddleware');
require('express-async-errors');
const router = express.Router();
const {check} = require('express-validator');

//----------------------get all users-----------------------------//
router.get('/getAllusers',authenticationMiddleware,async(req,res,next)=>{
    
const users=await User.find().populate('products');
res.json(users)
   
});
//-----------------get user by id ---------------------------//
 router.get('/:id',authenticationMiddleware,async(req,res,next)=>{
    const{id}=req.params;
    //const users=await User.find();
     const user= await User.findById(id)
     res.json(user)
    
    
     });

//------------------Add new user--------------------------------//

router.post('/Add',authenticationMiddleware,async(req,res,next)=>{
    
const {username ,password,age,email}=req.body;
const user=new User({username,password,age,email});
await user.save();
res.json(user)
   
});

//---------------------------UpdateUser---------------------------//
    router.patch('/Edit/:id',authenticationMiddleware,validationMiddleWare(
        check('password')
        .isLength({
            min: 5
        })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number')
    ),
     async (req, res, next) => {
            id = req.user.id;
        const {
            username,
            password,
            age,
            email
        } = req.body;
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                username,
                password,
                age,
                email
            }
        }, {
            new: true,
            runValidators: true,
            omitUndefined: true
        });
        res.status(200).json(user)
    })
    
////---------------------------delete user----------------------//

    router.delete('/delete/:id',authenticationMiddleware, async (req, res, next) => {
        const id= req.user.id;
        const user = await User.findByIdAndDelete(id);
        res.status(200).json(user)
    })
    
///-----------------------Register-----------------//
router.post('/register',validationMiddleWare(
    check('password')
    .isLength({
        min: 5
    })
    .withMessage('5 chars at least  ')
    .matches(/\d/)
    .withMessage('must contain a number')
), async (req, res, next) => {

    const {
        username,
        password,
        age,
        email
    } = req.body;
    const user = new User({

        username,
        password,
        age,
        email
    });

    await user.save();
    res.json(user);
})




    ////------------------------------login-----------------------//
    router.post('/login', async(req,res,next)=>{
        const{username,password}=req.body;
        const user=await User.findOne({username});
        if(!user) throw new Error('wrong username or password');
        const isMatch=await user.comparePassword(password);
        if(!isMatch) throw new Error('wrong username or password');
        
        const token=await user.generateToken();
        
        if(!token) throw new Error('token  cant created');
   
        res.json({token,user});
       
      
       
        })
        
            
    
   
      

module.exports=router;

