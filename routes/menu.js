const express = require('express');
const router =express.Router();
const menuController = require('../controllers/menu')
const authCheck = require('../services/authCheck')

router.get('/',menuController.getAllMenu);

router.get('/:id',menuController.getSingleMenu);

router.post('/',authCheck,menuController.createMenu);

router.put('/:id',authCheck,menuController.updateMenu);

router.delete('/:id',authCheck,menuController.deleteMenu);

module.exports = router