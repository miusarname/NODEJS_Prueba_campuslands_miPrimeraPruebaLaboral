import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from 'dotenv';

const app = express();

//setting
dotenv.config();
app.set("port", process.env.PORT || 3000);


//Middlewares
app.use(morgan("dev"));
app.use(express.json());

// //Routes
// const Routes = require("./routes/task.routes"); //Define a const Routes

// app.use("/api/task", Routes);


//Server
app.listen(app.get("port"), () => {
  console.log("server on port " + app.get("port"));
});