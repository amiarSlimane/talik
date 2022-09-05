const UsersModel  = require('../models/userModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');



 


const getAllUsers =  (params)=>{
  const { filter, limit, page} = params;
  return  UsersModel.find(filter).skip(limit*page).limit(limit);
}


const getOneUser = async (userId)=>{
  return UsersModel.findById(userId);
}


const getOneUserByEmail = async (email)=>{
  return UsersModel.findOne({
    email
  }).select('+password');;
}


const createOneUser = async (body)=>{
  return UsersModel.create(body);
}

const updateMe = catchAsync(async (req, res, next) => {
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

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});


// Do NOT update passwords with this!
const updateOneUser = factory.updateOne(UsersModel);
const deleteOneUser = factory.deleteOne(UsersModel);



module.exports = {
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  createOneUser,
  getOneUserByEmail,
  
}