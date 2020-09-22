const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

//Route for registering a user
router.post('/signup', UserController.signup);

//Route for logging in
router.post('/login', UserController.login);

//Route for deleting a user
router.delete('/:userId', checkAuth, UserController.delete_user);

module.exports = router;