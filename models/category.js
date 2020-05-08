var mongoose = require('mongoose');
// const _ = require('lodash');
// const validator=require('validator');


const categorySchema=new mongoose.Schema({
    categoryName:{
     type: String,
     required:true,
     unique: true,
     lowercase: true,
    },
     IsDeleted: {
        type: Boolean,
        default: false,
        required: false
      }
      // products: {
      //   type: [
      //     {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: "Products",
      //       default: []
      //     }
      //   ]
      // }
  //  }

},{});


const Category=mongoose.model('Category',categorySchema);


module.exports=Category;