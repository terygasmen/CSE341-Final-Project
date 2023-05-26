const express = require('express');
const router = express.Router();

const restaurantsController = require('../controllers/restaurants');

router.get('/', restaurantsController.getAll);

router.get('/:id', restaurantsController.getSingle);

router.post('/', restaurantsController.createRestaurant);

router.put('/:id', restaurantsController.updateRestaurant);

router.delete('/:id', restaurantsController.deleteRestaurant);

module.exports = router;