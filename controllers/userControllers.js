const User = require("./../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

//------USERS

const filterObj = (obj, ...allowedFields) =>{
  const newObj = {};
  Object.keys(obj).forEach(item => {
    if(allowedFields.includes(item)) newObj[item] = obj[item]
  })

  return newObj
}

exports.updateMe = catchAsync(async(req, res,next) => {
  //1 Create error if user updating password
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError("This route is not for password update. Please use /updateMyPassword",400))
  }
   //2 Update user data
   const filteredBody = filterObj(req.body,"name","email","role")
   const updateUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
    new: true,
    runValidators:true
   });

   res.status(200).json({
    status:"success",
    data:{
      user:updateUser
    }
   })
})

exports.deleteMe = catchAsync(async(req,res,next) =>{
  await User.findByIdAndUpdate(req.user._id , { active:false });

  res.status(200).json({
    status:"Success",
    message:"User deleted",
    data:null
  })
})

exports.getAllUsers = catchAsync(async(req, res,next) => {
  const users = await User.find();
  // /SEND QUERY
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
};

exports.getSingleUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
