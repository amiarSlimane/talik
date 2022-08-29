const express = require('express');

const router = express.Router();

module.exports = (param) => {
  const { comments } = param;
  // router.post('/:postId', comments.createOneComment);

  // Protect all routes after this middleware
  // router.use(authController.protect);
  router.get('/', async (req, res) => {
    
    try {
      let result = await comments.getAllcomments(req.query);

      return res.json( result);
    }catch (err) {
      return err;
    }

  });

  router.get('/post/:postId', async (req, res) => {
    
    try {
      
      const postId = req.params.postId;
      let result = await comments.getAllPostComments(postId, req.query);

      return res.json( result);
    }catch (err) {
      return err;
    }

  });


  router.get('/:commentId', async (req, res) => {
    
    try {
      const commentId = req.params.commentId;
      const query = req.query;
      let result = await comments.getOneComment(commentId, query);

      return res.json( result);
    }catch (err) {
      return err;
    }

  });


  router.get('/', async (req, res) => {
    
    try {
      let result = await comments.getAllcomments(req.query);

      return res.json( result);
    }catch (err) {
      return err;
    }

  });


  router.post('/:postId', async (req, res) => {
 
    try {
      let result = await comments.createOneComment(req.body, req.params.postId);

      return res.json( result);
    }catch (err) {
      return err;
    }

  });

  // router.delete('/:id', comments.deleteOneComment);

  return router;

}