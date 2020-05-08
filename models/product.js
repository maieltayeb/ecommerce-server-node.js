const mongoose=require('mongoose');
const validator=require('validator');
const _=require('lodash');

const productSchema=new mongoose.Schema({

    userId:{
    type:mongoose.ObjectId,
    ref:'User',
    //required:true
    
    
    }, categoryId:{
        type:mongoose.ObjectId,
        ref:'Category'
        
        
        },
    productName:{
        type: String,
        unique: true,
       lowercase: true,
        required:true,
    },
    productDescription:{
        type:String,
        required:true,
        minlength:5,
        maxlength:500,
    },
    productPrice:{
        type:Number,
        required:true,
       
    },
    productDiscount:{
        type:Number,
        required:true,
        default:0,
       
    },
  photo: {
    type: String,
    //required: true
  },
  IsDeleted: {
    type: Boolean,
    default: false
  },

},{timestamps:true,


toJSON:{
    virtuals:true,
    transform:(doc)=>{
        return _.pick(doc,['_id','productName','userId','categoryId','productDescription','photo','productDiscount','productPrice','IsDeleted','category','user'])// to extract some properties from user
    }
}
});// to send options
productSchema.virtual('user',{
    ref:'User',
    localField:'userId',
    foreignField:'_id'}
    );
 productSchema.virtual('category',{
        ref:'Category',
        localField:'categoryId',
        foreignField:'_id'}
        );
    




const Product=mongoose.model('Product',productSchema);
module.exports=Product;