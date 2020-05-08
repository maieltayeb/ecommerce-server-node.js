const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const Category=require('../models/category')

const authenticationMiddleware=require('../middlewares/authentication');
const ownerAuthorizationMiddleWare=require('../middlewares/ownerAuthorization');
require('express-async-errors');

//---------------------Get all products//----------------------
router.get("/GetAll",async (req, res, next) => {
    

    const products= await Product.find();
    
  
    res.status(200).json(products);
});
 //-------------------------------get product by id -----------------//
 router.get('/:id',(req,res,next)=>{
    const {id} = req.params;
    Product.findById(id)

    .then(product=>res.send(product))
    .catch(err=>next(err.message))
    })
  
//-----------------------------Add new product------------------------//
     router.post('/Add',authenticationMiddleware,async (req, res, next) => {

    const { categoryId, productName, productDiscount,photo,IsDeleted,productDescription, productPrice } = req.body;
    const userId=req.user.id;
     const product = new Product({  userId,  categoryId,productName, productDiscount,productDescription, productPrice,IsDeleted,photo,});
            await product.save();
            console.log("product saves");
            res.json(product)
        })






 ////------------------edit product by id ----------------------//
        router.patch('/Edit/:id',ownerAuthorizationMiddleWare,authenticationMiddleware,
   
    async (req, res, next) => {

        const {id} = req.params;
        const {
            userId,
            categoryId,
            productName,
            productDescription,
            productDiscount,
            productPrice} = req.body;

        const product = await Product.findByIdAndUpdate(id, {
            
            
            productName,
            productDescription,productDiscount,
            productPrice,userId,categoryId
        }, {
            new: true,
            runValidators: true,
            omitUndefined: true
        });
     
        res.status(200).json({
            message: "product Edit Succssfully",
            product
        })
      
    })

 //-------------------------delete product--------------------------------------------//

    router.delete('/:id',authenticationMiddleware,ownerAuthorizationMiddleWare, async (req, res, next) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    console.log("pro duct to delete")
    res.status(200).json(product)
})

//------------search about product by productName--------------------------//
router.get("/search/:productName", async (req, res, next)=> {
    
    const{productName}=req.params;
    const products= await Product.find();

   let product= products.filter(product=> {
     
      if( product.productName.includes(productName))
      return product;
      
      });
 
      res.status(200).json(product);
     
       })
      
   ;


    module.exports=router;