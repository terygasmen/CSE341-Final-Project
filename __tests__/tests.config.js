const app = require('../server');
const supertest = require('supertest');
module.exports = () => supertest(app);