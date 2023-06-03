const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurants');
const authCheck = require('../services/authCheck');

router.get('/', restaurantsController.getAllRestaurant);
router.get('/:id', restaurantsController.getSingleRestaurant);
router.post('/', restaurantsController.createRestaurant);
router.put('/:id',authCheck, restaurantsController.updateRestaurant);
router.delete('/:id',authCheck, restaurantsController.deleteRestaurant);

module.exports = router;