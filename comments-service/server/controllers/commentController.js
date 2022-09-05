const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const commentsService = require('../services/commentsService');


const amqplib = require('amqplib');


const q = 'comments';
(async () => {

  try {
    let conn = await amqplib.connect('amqp://localhost');
    let channel = await conn.createChannel();
     channel.assertQueue(q).then(() => channel.consume(q, (msg) => {

      if (msg !== null) {
        const qm = JSON.parse(msg.content.toString());
  
        commentsService.createOneComment({ ...qm.body, postId: qm.postId })
          .then((result) =>{
            channel.ack(msg)});
      }
     }))
   

  } catch (err) {
    console.error(err);
  };

})();

exports.createOneComment = catchAsync(async (req, res) => {
  const body = req.body;
  const postId = req.params.postId;
  body.post = postId;
  const result = await commentsService.createOneComment(body);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.getAllPostComments = catchAsync(async (req, res) => {

  const limit = req.query.limit;
  const page = req.query.page;

  let params = {};
  params.limit = limit;
  params.page = page;
  const postId = req.params.postId;
  params.postId = postId;
  const result = await commentsService.getAllPostComments(params);

  res.status(200).json({
    status: 'success',
    data: result,
  });

})


exports.getOneComment = catchAsync(async (req, res) => {

  const commentId = req.params.commentId;
  const result = await commentsService.getOneComment(commentId);

  res.status(200).json({
    status: 'success',
    data: result,
  });

})

exports.getAllComments = catchAsync(async (req, res) => {

  const limit = req.query.limit;
  const page = req.query.page;

  let params = {};
  params.limit = limit;
  params.page = page;
  params.filter = {};
  const result = await commentsService.getAllComments(params);

  res.status(200).json({
    status: 'success',
    data: result,
  });

})

// Do NOT update passwords with this!
exports.updateOneComment = factory.updateOne(Comment);
exports.deleteOneComment = factory.deleteOne(Comment);
