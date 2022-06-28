const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/:postId', commentController.createOneComment);
 
// Protect all routes after this middleware
router.use(authController.protect);
router.get('/', commentController.getAllComments);
 
router.delete('/:id', commentController.deleteOneComment);



module.exports = router;