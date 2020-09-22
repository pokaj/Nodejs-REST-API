const Order = require('../models/orders');
const Product = require('../models/product');
const mongoose = require('mongoose');

//Controller to get all orders 
exports.orders_get_all = (req, res, next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .exec()
    .then(results=>{
        res.status(200).json({
            count: results.length,
            Order:results.map(result =>{
                return {
                    _id: result._id,
                    product:result.product,
                    quantity:result.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/' + result._id
                    }
                };
            })
        });
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
};

//Controller to create an order
exports.create_order = (req, res, next)=>{
    Product.findById(req.body.productId)
    .exec()
    .then(product =>  {
        if(!product){
            return res.status(404).json({
                message:"Product not found in Database"
            });
        };
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product:req.body.productId
        });
        return order.save();
    })
    .then(result=>{
        res.status(201).json({
            message:'Order Stored',
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                type:'GET',
                url:'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
};

//Controller for getting one order
exports.get_one_order = (req, res, next)=>{
    Order.findById(req.params.productId)
    .populate('product','name')
    .exec() 
    .then(results=>{
        res.status(200).json({
            order:results,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders'
            }
        })
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
};


//Controller for deleting an order
exports.delete_order = (req, res, next)=>{
    Order.remove({_id:req.params.productId})
    .exec()
    .then(result=>{
        if(!result){
            res.status(404).json({message:'Order not found'})
        }
        res.status(200).json({
            message:'Order deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/orders/',
                body:{
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        })
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
};