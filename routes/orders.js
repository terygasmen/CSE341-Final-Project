const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const authCheck = require('../services/authCheck');

router.get('/', orderController.getAllOrder);
router.get('/:id', orderController.getSingleOrder);
router.post('/', orderController.createOrder);
router.put('/:id',authCheck, orderController.updateOrder);
router.delete('/:id',authCheck, orderController.deleteOrder);

module.exports = router;