const CommentsModel  = require('../models/commentModel');

const getAllComments =  (params)=>{
  const { filter, limit, page} = params;
  return  CommentsModel.find(filter).skip(limit*page).limit(limit);
}


const getAllPostComments = async (params, query)=>{
  const {postId} = params;
  const { limit, page} = query;

  return CommentsModel.find({post:postId})
  .skip(limit*page||0)
  .limit(limit||25)
  .populate('replies');
}


const getAllRepliesOfComment = async (params, query)=>{
  const {commentId} = params;
  const { limit, page} = query;

  return CommentsModel.findById(commentId)
  .skip(limit*page||0)
  .limit(limit||25)
  .populate('replies');
}

const getOneComment = async (commentId)=>{
  return CommentsModel.findById(commentId);
}


const createOneComment = async (body)=>{
  return CommentsModel.create(body);
}


const createOneCommentReply = async (parentCommentId, commentId)=>{
  return CommentsModel.updateOne(
    {_id:parentCommentId}, 
    {$push:{replies:commentId}});
}


const updateOneComment = async (commentId, body)=>{
  return;
}

const deleteOneComment = async (commentId)=>{
  return;
}

module.exports = {
  getAllComments,
  getAllPostComments,
  getOneComment,
  getAllPostComments,
  updateOneComment,
  deleteOneComment,
  createOneComment,
  createOneCommentReply,
  getAllRepliesOfComment,
}