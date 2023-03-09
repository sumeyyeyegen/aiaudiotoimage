// PART 4 --------------

// const express = require("express");
// const morgan = require("morgan");

// const nftsRouter = require("./routes/nftsRoute");
// const usersRouter = require("./routes/usersRoute");

// const app = express();
// app.use(express.json());

// // if (process.env.NODE_ENV === "development ") {
// //   app.use(morgan("dev"));
// // }
// app.use(morgan("dev"));
// //SERVING TEMPLATE DEMO
// app.use(express.static(`${__dirname}/nft-data/img`));

// //CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function 👋");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// app.use("/api/v1/nfts", nftsRouter);
// app.use("/api/v1/users", usersRouter);

// module.exports = app;


// PART 5 ================ ERROR

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require('cors');

const globalErrorHandler = require("./controllers/errorController");
const ArrError = require("./Utils/appError");
const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");
const blogsRouter = require("./routes/blogsRoute");

const app = express();
app.use(express.json({limit:"10kb"}));

//DATA SANITIZATION against NoSQL query injection
app.use(mongoSanitize());
//DATA SANITIZATION against site script XSS
app.use(xss());

//PREVENT PAARAMETER POLLUTION
app.use(hpp({
  whitelist: ["duration","difficulty","maxGroupSize","price","ratingsAverage","ratingsQuantity"]
}));

//SECURE HEADER HTTP
app.use(helmet());
// if (process.env.NODE_ENV === "development ") {
//   app.use(morgan("dev"));
// }

//GLOBAL MIDDLEWARE

//Rate Limit
const limiter = rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:"Too many request from this IP,please try again in an hour"
})

app.use("/api",limiter);

app.use(morgan("dev"));
//SERVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nft-data/img`));

//CUSTOM MIDDLE WARE
app.use((req, res, next) => {
  console.log("Hey i am from middleware function 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(cors({
  origin: '*'
}));

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/blogs", blogsRouter);

//ERROR SECTION
app.all("*",(req,res,next) =>{
  res.status(404).json({
    status:"fail",
    message:`Can't find ${req.originalUrl} on this server`
  })

//   const err = new Error(`Can't find ${req.originalUrl} on this server`)
//   err.status = "fail";
//   err.statusCode=404;
// next(err)

next(new ArrError(`Can't find ${req.originalUrl} on this server`,404))
});

//global error handeling
app.use(globalErrorHandler);

module.exports = app;