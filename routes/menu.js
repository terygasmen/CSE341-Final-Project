const express = require('express');
const router =express.Router();
const menuController = require('../controllers/menu')

router.get('/',menuController.getAll);

router.get('/:id',menuController.getSingle);

router.post('/',menuController.createMenu);

router.put('/:id',menuController.updateMenu);

router.delete('/:id',menuController.deleteMenu);

module.exports = router