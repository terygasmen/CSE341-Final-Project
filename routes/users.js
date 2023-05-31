const express = require('express')

const router = express.Router();
const userController = require('../controllers/users')



router.get('/',userController.getAllUser);
router.get('/id',userController.getOneUser);
router.post('/',userController.createUser);
router.put('/update/id',userController.updateUser);
router.delete('/delete/id',userController.deleteUser);

module.exports= router