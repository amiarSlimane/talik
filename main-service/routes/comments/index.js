const express = require('express');
const AppError = require('../../utils/appError');
const router = express.Router();

module.exports = (param) => {
  const { comments } = param;
  // router.post('/:postId', comments.createOneComment);

  // Protect all routes after this middleware
  // router.use(authController.protect);
  router.get('/', async (req, res, next) => {
    
    try {
      let result = await comments.getAllcomments(req.query);

      return res.json( result);
    }catch (err) {
      return next(new AppError(err, 400));
    }

  });

  router.get('/post/:postId', async (req, res , next) => {
    
    try {
      
      const postId = req.params.postId;
      let result = await comments.getAllPostComments(postId, req.query);

      return res.json( result);
    }catch (err) {
      return next(new AppError(err, 400));
    }

  });


  router.get('/reply/:commentId', async (req, res , next) => {
    
    try {
      
      const commentId = req.params.commentId;
      let result = await comments.getAllRepliesOfComment(commentId, req.query);

      return res.json( result);
    }catch (err) {
      return next(new AppError(err, 400));
    }

  });




  router.get('/:commentId', async (req, res , next) => {
    
    try {
      const commentId = req.params.commentId;
      const query = req.query;
      let result = await comments.getOneComment(commentId, query);

      return res.status(result.statusCode).json(result.data);
    }catch (err) {
      return next(new AppError(err, 400));
    }

  });

  router.get('/', async (req, res , next) => {
    
    try {
      let result = await comments.getAllcomments(req.query);

      return res.status(result.statusCode).json(result.data);
    }catch (err) {
      return next(new AppError(err, 400));
    }

  });


  router.post('/:postId', async (req, res , next) => {
 
    try {
      //we cane use rabbitmq version or normal version
      //let result = await comments.createOneCommentAMQP(req.body, req.params.postId);//9664/10s
      let result = await comments.createOneComment(req.body, req.params.postId); //1876/10s

      return res.status(result.statusCode).json(result.data);
    }catch (err) {
      return next(new AppError(err, 400));
    }

  });

  router.post('/:postId/comment/:commentId', async (req, res , next) => {
 

    try {
      //let result = await comments.createOneCommentAMQP(req.body, req.params.postId);//9664/10s
      let result = await comments.createOneCommentReply(req.body, req.params.postId, req.params.commentId); //1876/10s

      return res.status(result.statusCode).json(result.data);
    }catch (err) {
      console.log('err-----------------', err);
      return next(new AppError(err, 400));
    }

  });

  // router.delete('/:id', comments.deleteOneComment);

  return router;

}

 