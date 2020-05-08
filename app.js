const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const port = 4402;
const userRouter=require('./routes/user');
const productRouter=require('./routes/product');
const categoryRouter=require('./routes/category');
require('express-async-errors');
require('dotenv').config();
var cors = require('cors')
require('./db');
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
// app.use(express.json());
// app.use(express.urlencoded());



app.use(cors())


 app.use('/user',userRouter);
 app.use('/product',productRouter);
 app.use('/category',categoryRouter);

///global error handler
app.use((err,req,res,next) => {
    console.log(err)
    const statusCode= err.statusCode || 500;
   
    res.status(statusCode).json({
     
        meesage:err.message,
        type:err.type,
        details:err.details
    })
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))