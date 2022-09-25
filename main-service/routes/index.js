const express = require('express');

const router = express.Router();

const commentsRoute = require('./comments/index');
const userssRoute = require('./users/index');

module.exports = (param) => {
  
 
  router.use('/comments', commentsRoute(param));
  router.use('/users', userssRoute(param));

  return router;
};
