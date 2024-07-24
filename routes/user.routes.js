const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controllers');

router.get('/', userController.findAll);
router.post('/', userController.create)
router.get('/:id', userController.findById);
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/users', userController.getUsersWithPagination);


module.exports = router;
