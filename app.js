const express = require('express');
const app = express();
const morgan = require('morgan'); //logging information on in-coming requests.
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://kwabena:' + process.env.MONGO_ATLAS_PW + '@cluster0.kjc0d.mongodb.net/'+ process.env.MONGO_ATLAS_DB + '?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true 
})
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
})

//Routes hadndling requests
app.use('/products', productsRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});


module.exports = app; 