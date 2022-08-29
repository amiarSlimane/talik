const express = require('express');

const router = express.Router();

const commentsRoute = require('./comments/index');

module.exports = (param) => {
  
 
   router.use('/comments', commentsRoute(param));

  return router;
};
