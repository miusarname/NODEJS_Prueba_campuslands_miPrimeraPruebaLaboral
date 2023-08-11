import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import bodegas from "./routes/bodegas.routes.js";
import productos from "./routes/productos.routes.js";
import inventarios from './routes/inventarios.routes.js';
import "reflect-metadata";
const app = express();
//setting
dotenv.config();
app.set("port", process.env.PORT || 3000);
//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "*" }));
//Routes
app.use("/bodegas", bodegas);
app.use('/inventarios', inventarios);
app.use("/productos", productos);
//Server
app.listen(app.get("port"), () => {
    console.log("server on port " + app.get("port"));
});
