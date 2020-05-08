const express=require('express');
const router=express.Router();
const Category=require('../models/category');
const authenticationMiddleware=require('../middlewares/authentication');

//-----------------get all categories-----------------/
router.get('/getAllcategories',async(req,res,next)=>{
const categories=await Category.find();
res.json(categories)
       
    });
    
//----------------Add new category---------------//
router.post('/Add',async(req,res,next)=>{
        const {categoryName}=req.body;
        const category=new Category({categoryName});
        await category.save();
        res.json(category);
           
        });
    module.exports=router;