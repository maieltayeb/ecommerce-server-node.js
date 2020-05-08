var mongoose = require('mongoose');
const _ = require('lodash');
const validator=require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util=require('util');
require('dotenv').config();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const CustomError = require('../helpers/customErorr');


const userSchema=new mongoose.Schema({
    username:{
     type: String,
     required:true,
     minlength:5,
     unique: true
    },
    password:{
        type:String,
        required:true,
      
    },
    age:{
        type:Number,
        min:10,
        default:0
    },
    
    email:{
        type:String,
        required:true,
        validate:(v)=>{
   return validator.isEmail(v);

       }
   
    }

},{});

const sign=util.promisify(jwt.sign);
const verify=util.promisify(jwt.verify);

userSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'userId',
    
  });
  userSchema.set('toJSON',{virtuals:true,
  
    transform:(doc)=>{
        return _.pick(doc,['username','email','age','id','products'])
    }
    
    });
//---------------------to check password of spesifed user-----------------//

userSchema.methods.comparePassword=function(plainPassword){
    const userInstance=this;
   return bcrypt.compare(plainPassword, userInstance.password);
}

//---------------------generate token for this user------------------------------//
userSchema.methods.generateToken=function(expiresIn='60m'){
    const userInstance=this;
    //payload,secret,option
    return sign({userId:userInstance.id},jwtSecret,{expiresIn})
}
///----------------get user from token----------------------//
userSchema.statics.getUserFromToken= async function (token) {
    const User = this;
    const payload = await verify(token,jwtSecret);
    const currentUser = await User.findById(payload.userId);
    if(!currentUser) throw CustomError(' there is no user wthi these data  ',404)
    return currentUser;
     
}

//every time password changed i have to hash it before saving in database
    
userSchema.pre('save', async function(){
       const userInstance=this;
       if(this.isModified('password')){
        userInstance.password=await bcrypt.hash(userInstance.password, saltRounds) 
            // Store hash in your password DB.
        
       }
    })

const User=mongoose.model('User',userSchema);


module.exports=User;