const {promisify} = require("util")
const User = require("../models/userModel");
const catchAsync = require("../Utils/catchAsync");
const jwt = require("jsonwebtoken")
const AppError = require("../Utils/appError")

//CREATE TOKEN
const signToken = id =>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN,
  })
}

//SIGNUP
exports.signup = catchAsync(async (req,res,next) =>{
  const newUser = await User.create(req.body);

// const newUser = await User.create({
//   name:req.body.name,
//   email:req.body.email,
//   password:req.body.password,
//   passwordConfirm: req.body.passwordConfirm
// });

const token = signToken(newUser._id);

res.status(201).json({
  status:"Success",
  token,
  data:{
    user:newUser
  }
})
});

//LOGIN USER
exports.login = catchAsync(async(req,res,next) =>{
  const {email, password} = req.body;

  if(!email || !password){
   return next(new AppError("Please provide your email & password"))
  }

  const user = await User.findOne({email}).select("+password")

  if(!user || !(await user.correctPassword(password,user.password))){
return next(new AppError("Incorrect email and password",401))
  }

  const token = signToken(user.id);
  res.status(200).json({
    status:"success",
    token
  })
});

//PROTECTING DATA
exports.protect = catchAsync(async(req,res,next) =>{
    //1 Check token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(" ")[1];
      
    }
    if(!token){
      return next(new AppError("You are not logged in to get access",401));
    }
    //2 validate token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //3 user exist

    const currentUser = await User.findById(decoded.id) 
    if(!currentUser){
      return next(new AppError("The User belonging to this token no longer exist",401))
    } 
    //4 change password 
    if(currentUser.changedPasswordAfter(decoded.iat)){
      return next(
        new AppError("User recently changed the password",401)
      )
    };
    //USER WILL HAVE ACCESS THE PROTECTED DATA
    req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) =>{
  return(req,res,next) =>{
    if(!roles.includes(req.user.role)){
      return next(new AppError("You have not access to delete NFT",403));
    }
    next();
  }
}

//NOW WE GOING TO WORK ON

//FORGOT PASSWORD
exports.forgotPassword = catchAsync(async(req,res,next) =>{
  // 1 Get the user based on the given email
const user = await User.findOne({email:req.body.email});
if(!user){
  return next(new AppError("There in no user with this email",404));
}
  // 2 Create a random Token
  const resetToken = user.createPasswordResetToken()
  await user.save({validateBeforeSave:false});
  // 3 Send email back to user
})
//RESET PASSWORD
exports.resetPassword = catchAsync(async(req,res,next) =>{
  
})