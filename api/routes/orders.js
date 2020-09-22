const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/orders');

// Endpoint for getting all orders
router.get('/', checkAuth, OrderController.orders_get_all);

//Enpoint for creating a new order
router.post('/', checkAuth, OrderController.create_order);

//Endpoint for getting one order
router.get('/:productId', checkAuth, OrderController.get_one_order);

//Endpoint for deleting an order
router.delete('/:productId', checkAuth, OrderController.delete_order);

module.exports = router;