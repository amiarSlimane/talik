const CommentsModel  = require('../models/commentModel');

const getAllComments =  (params)=>{
  const { filter, limit, page} = params;
  return  CommentsModel.find(filter).skip(limit*page).limit(limit);
}


const getAllPostComments = async (params)=>{
  const {postId, limit, page} = params;
  return CommentsModel.find({post:postId}).skip(limit*page||0).limit(limit||25);
}

const getOneComment = async (commentId)=>{
  return CommentsModel.findById(commentId);
}


const createOneComment = async (body)=>{
  return CommentsModel.create(body);
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
}