const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.route('/')
  .get(userController.getAll)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getOne)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
