import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import bodegas from "./routes/bodegas.routes.js";
import productos from "./routes/productos.routes.js";
import inventarios from './routes/inventarios.routes.js'

const app = express();

//setting
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
app.set("port", process.env.PORT || 3000);
const __dirname = dirname(__filename);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));

//Routes
app.use("/bodegas", bodegas);
app.use('/inventarios',inventarios);
app.use("/productos", productos);

//Server
app.listen(app.get("port"), () => {
  console.log("server on port " + app.get("port"));
});
