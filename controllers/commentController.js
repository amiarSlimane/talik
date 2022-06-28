const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

 

exports.createOneComment = factory.createOne(Comment, 'comment');

exports.getOneComment = factory.getOne(Comment, 'comment');
exports.getAllComments = factory.getAll(Comment,'comment');

// Do NOT update passwords with this!
exports.updateOneComment = factory.updateOne(Comment);
exports.deleteOneComment = factory.deleteOne(Comment);
