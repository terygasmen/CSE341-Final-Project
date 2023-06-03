const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authCheck = require('../services/authCheck');

router.route('/').get(userController.getAll).post(userController.createUser);

router.get('/:id', userController.getOne);
router.put('/:id', authCheck, userController.updateUser);
router.delete('/:id', authCheck, userController.deleteUser);

module.exports = router;
