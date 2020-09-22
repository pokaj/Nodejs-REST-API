const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//Controller for Registering a User
exports.signup = (req, res, next)=>{
    User.find({ email : req.body.email })
    .exec()
    .then(user =>{
        if(user.length >=1 ){
            return res.status(409).json({
                message:'User with this email already exists'
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password:hash
                    });
                    user.save()
                    .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message:'User created'
                        });
                    })
                    .catch(error=>{
                        console.log(error)
                        res.status(500).json({
                            error:error
                        });
                    });
                }
            });
        };
    })
    .catch();
};


//Controller for logging in
exports.login = (req, res, next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({message: 'Authentication failed! Check E-mail or Password'});
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({message: 'Authentication failed! Check E-mail or Password'}); 
            }
            if(result){
                const token = jwt.sign({
                    email:user[0].email,
                    userId:user[0]._id
                }, 
                process.env.JWT_KEY, {expiresIn:"1h"}
                )
                return res.status(200).json({message:'Authentication successful', token:token});
            }
            res.status(200).json({message:'Authentication failed! Check E-mail or Password'});
        });
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({
            error:error
        });
    });
};


//Controller for deleting a user
exports.delete_user = (req, res, next)=>{
    User.find({ email : req.body.email })
    .exec()
    .then(user=>{
        if(user.length >=1){
            User.remove({_id:req.params.userId})
            .exec()
            .then(response=>{
                res.status(200).json({message:'Your account has been deleted'});
            })
            .catch(err=>{
                res.status(500).json({error:err});
            })
        }else{
            return res.status(409).json({
                message:'This user does not exist in the database'
            });
        }
    })
};