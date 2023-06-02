const express = require('express');
const router =express.Router();
const menuController = require('../controllers/menu')

router.get('/',menuController.getAllMenu);

router.get('/:id',menuController.getSingleMenu);

router.post('/',menuController.createMenu);

router.put('/:id',menuController.updateMenu);

router.delete('/:id',menuController.deleteMenu);

module.exports = router