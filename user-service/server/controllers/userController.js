const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const userService = require('../services/userService');




exports.createOneUser = catchAsync(async (req, res) => {
  const body = req.body;
 
  const result = await userService.createOneUser(body);

  res.status(200).json({
    status: 'success',
    data: result,
  });

});

exports.getAllUsers = catchAsync(async (req, res) => {

 
  const limit = req.query.limit;
  const page = req.query.page;

  let params = {};
  params.limit = limit;
  params.page = page;
  const result = await userService.getAllUsers(params);

  res.status(200).json({
    status: 'success',
    data: result,
  });

})


exports.getOneUser = catchAsync(async (req, res) => {

  const userId = req.params.userId;
  const result = await userService.getOneUser(userId);

  res.status(200).json({
    status: 'success',
    data: result,
  });

})
















const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

   
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  
});

exports.createUser = (req, res) => {
  
};

exports.getUser = factory.getOne(User, 'user');
exports.getAllUsers = factory.getAll(User,'users');

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// Do NOT update passwords with this!
exports.updateOneUser = factory.updateOne(User);
exports.deleteOneUser = factory.deleteOne(User);
