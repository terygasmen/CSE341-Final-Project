const express = require('express');
const router =express.Router();
const itemController = require('../controllers/items');
const authCheck = require('../services/authCheck');

router.get('/',itemController.getAllItem);
router.get('/:id',itemController.getSingleItem);
router.post('/',authCheck,itemController.createItem);
router.put('/:id',authCheck,itemController.updateItem);
router.delete('/:id',authCheck,itemController.deleteItem);

module.exports = router;