const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const commentsService = require('../services/commentsService');
var validator = require('validator');
const Joi = require('joi');

const mongoose = require('mongoose');


const amqplib = require('amqplib');

const rabbitmqUrl = process.env.NODE_ENV=='production'?'amqp://rabbitmq_service':'amqp://localhost';
const q = 'comments';
(async () => {

  try {
    let conn = await amqplib.connect(rabbitmqUrl);
    let channel = await conn.createChannel();
    channel.assertQueue(q).then(() => channel.consume(q, (msg) => {

      if (msg !== null) {
        const qm = JSON.parse(msg.content.toString());

        commentsService.createOneComment({ ...qm.body, postId: qm.postId })
          .then((result) => {
            channel.ack(msg)
          });
      }
    }))


  } catch (err) {
    console.error(err);
  };

})();

exports.createOneComment = catchAsync(async (req, res, next) => {

  const body = req.body;
  const postId = req.params.postId;
  body.post = postId;

  const commentSchema = Joi.object({
    content: Joi.string().required(),
    post: Joi.string().required(),
  });

  await commentSchema.validateAsync(body);
  const result = await commentsService.createOneComment(body);

  res.status(200).json({
    status: 'success',
    data: result,
  });


});



exports.createOneCommentReply = catchAsync(async (req, res) => {
  const body = req.body;
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  body.post = postId;

  const commentSchema = Joi.object({
    content: Joi.string().required(),
    post: Joi.string().required(),
  });

  await commentSchema.validateAsync(body);

  const comment = await commentsService.createOneComment(body);
  const result = await commentsService.createOneCommentReply(commentId, comment._id);

  res.status(200).json({
    status: 'success',
    data: comment,
  });
});





exports.getAllPostComments = catchAsync(async (req, res, next) => {

  const querySchema = Joi.object({
    limit: Joi.number().integer().min(0).default(10),
    page: Joi.number().integer().min(0).default(0),
  });


  await querySchema.validateAsync(req.query);

  let params = {};
  const postId = req.params.postId;
  params.postId = postId;

  const result = await commentsService.getAllPostComments(params, req.query);

  res.status(200).json({
    status: 'success',
    data: result,
  });


})


exports.getAllRepliesOfComment = catchAsync(async (req, res, next) => {

  const querySchema = Joi.object({
    limit: Joi.number().integer().min(0).default(10),
    page: Joi.number().integer().min(0).default(0),
  });


  await querySchema.validateAsync(req.query);

  let params = {};
  const commentId = req.params.commentId;
  params.commentId = commentId;

  const result = await commentsService.getAllPostComments(params, req.query);

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
