const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException",(err) =>{
  console.log(err); 
  console.log('UncaughtException shutting down application ');
    process.exit(1);
} )


dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log("DB Connection Successfully");
  })
  // .catch(err => console.log('ERROR'))

const port = 3006;
const server = app.listen(port, () => {
  console.log('Mode : ', process.env.NODE_ENV);
  console.log(`App running on port ${port}....`);
});

process.on("unhandledRejection",err =>{
  console.log(err.name,err.message); 
  console.log('Unhandlerejection shutting down application ');
  server.close(() =>{
    process.exit(1);
  })
}) 
