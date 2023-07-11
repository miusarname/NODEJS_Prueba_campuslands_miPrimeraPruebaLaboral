import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'
import bodegas from './routes/bodegas.routes.js'


const app = express();

//setting
dotenv.config();
app.set("port", process.env.PORT || 3000);
const __dirname = path.dirname(import.meta.url);



//Middlewares
app.use(morgan("dev"));
app.use(express.json());
const front= path.join(__dirname + '/public')
app.use(express.static(front)); 
app.use(cors({ origin: '*'}));

//Routes
app.use('/bodegas', bodegas);


//Server
app.listen(app.get("port"), () => {
  console.log("server on port " + app.get("port"));
});