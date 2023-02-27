const AppError = require("../Utils/appError");

const handleJWTError = () =>{
 return  new AppError("Invalid token,Please log in again",401);
}

const handleJWTExpiredError = () =>{
  new AppError("Your token got expired please login again",401);
}

const handleCastErrorDB = err =>{
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message,400);
}

const handleDuplicateFieldsDB = err =>{
  const value = err.errmsg.match(/(?<=")(?:\\.|[^"\\])*(?=")/)
  console.log('value',value);
  const message = `Duplicate field values ${value}. Please use another value`
  return new AppError(message,400);
}

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(item => item.message);
  const message = `Invalid input data ${errors.join(". ")}`;
  return new AppError(message,400);
}

const sendErrorDev = (err,res) =>{
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error:err,
    stack:err.stack
  })
}

const sendErrorPro = (err,res) =>{
  if(err.isOperational){
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
    // error:err,
    // stack:err.stack
  })
}else{
  console.log('err',err);
  res.status(500).json({
    status:"error",
    message:"Something went very wrong"
  })
}
}

module.exports = (err,req,res,next) =>{
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  if(process.env.NODE_ENV === "development"){
    sendErrorDev(err,res);
  }else if(process.env.NODE_ENV === "production"){
    let error = {...err};
    if(error.name === "CastError") error = handleCastErrorDB(error);
    if(error.code===11000) error = handleDuplicateFieldsDB(error);
    if(error.name === "ValidationError") error=handleValidationError(error);
    if(error.name === "JsonWebTokenError") error = handleJWTError();
    if(error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorPro(error,res);
  }

  
  next();
};