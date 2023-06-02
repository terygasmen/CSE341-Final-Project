const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');

router.get('/', orderController.getAllOrder);
router.get('/:id', orderController.getSingleOrder);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;