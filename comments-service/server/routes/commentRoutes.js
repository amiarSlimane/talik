const express = require('express');
const commentController = require('../controllers/commentController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.post('/:postId', commentController.createOneComment);
router.post('/:postId/comment/:commentId', commentController.createOneCommentReply);
 
// Protect all routes after this middleware
// router.use(authController.protect);

/**
 * @openapi
 * /:
 *   get:
 *     description: Get All comments 
 *     responses:
 *       200:
 *         description: Returns an array of comments.
 */
router.get('/', commentController.getAllComments);
router.get('/post/:postId', commentController.getAllPostComments);
router.get('/reply/:commentId', commentController.getAllRepliesOfComment);
router.get('/:commentId', commentController.getOneComment);
 
router.delete('/:id', commentController.deleteOneComment);



module.exports = router;