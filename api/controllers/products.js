const mongoose = require('mongoose');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');


// Controller for getting all products from the database
exports.get_all_products = (req, res, next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(results=>{
        const response = {
            count:results.length,
            products:results.map(result=>{
                return {
                    name: result.name,
                    price: result.price,
                    productImage:result.productImage,
                    _id: result._id,
                    request:{
                        type:'GET',
                        description:'Get product',
                        url:'http://localhost:3000/products/' + result._id
                    }
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    });
};


//Controller for creating a new product
exports.create_new_product =  (req, res, next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price, 
        productImage: req.file.path
    });
    product.save()
    .then(result=>{
        res.status(201).json({
            message:'Created product successfully',
            createProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                    description:'Get product',
                    url:'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error:error});
    
    });
};


//Controller for getting one product
exports.get_one_product = (req, res, next)=>{
    const id = req.params.id;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(results => {
        if(results){
            res.status(200).json({
                product:results,
                request:{
                    type:'GET',
                    description:'Get all products',
                    url:'http://localhost:3000/products/'
                }
            });
        }else{
            res.status(404).json({message:"No valid entry found"});
        }
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({error:error});
    });
};

//Controller for updating the details of a product
exports.edit_product_details = (req, res, next)=>{
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id},{$set:updateOps})
    .exec()
    .then(results=>{
        res.status(200).json({
            message:'Product updated',
            request:{
                type:'GET',
                description:"Get updated product",
                url:'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({error:error});
    });    
};


//Controller for deleting a product
exports.delete_product = (req, res, next)=>{
    const id = req.params.id;
    Product.remove({_id:id})
    .exec()
    .then(results=>{
        res.status(200).json({
            message:'Product deleted',
            request:{
                type:'POST',
                description:'Create new product',
                url:'http://localhost:3000/products/',
                body:{name:'String', price:'Number'}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })   
};