const express = require('express');
const router = express.Router();

router.use('/restaurants', require('./restaurants'));
router.use('/menu',require('./menu'));
router.use('/users', require('./users'));
router.use('/items', require('./items'));

module.exports = router;