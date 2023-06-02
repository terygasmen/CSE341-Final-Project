const express = require('express');
const router = express.Router();

// router.get('/', (err, req, res, next) => res.status(200).send('blub'));
// request(router).get('/').end(); // status not a function
// request(app.use(router)).get('/').end(); // works 

router.use('/restaurants', require('./restaurants'));
router.use('/menu', require('./menu'));
router.use('/users', require('./users'));
router.use('/items', require('./items'));
router.use('/orders', require('./orders'));

module.exports = router;
