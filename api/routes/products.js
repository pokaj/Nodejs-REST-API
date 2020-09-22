const express = require('express');
const router = express.Router();
const multer = require('multer');
const productsController = require('../controllers/products');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    };
};

const upload = multer({
    storage:storage, 
    limits:{fileSize:1024 * 1024 * 5},
    fileFilter:fileFilter
});


// Endpoint for retrieving all products from the database
router.get('/', productsController.get_all_products);

// Endpoint for creating a new product in the database
router.post('/', checkAuth, upload.single('productImage'), productsController.create_new_product);

// Endpoint for retrieving a specific product from the database
router.get('/:id', checkAuth, productsController.get_one_product);

// Endpoint for editing a product in the database
router.patch('/:id', checkAuth, productsController.edit_product_details);

// Endpoint for deleting a product from the database
router.delete('/:id', checkAuth, productsController.delete_product);


module.exports = router;