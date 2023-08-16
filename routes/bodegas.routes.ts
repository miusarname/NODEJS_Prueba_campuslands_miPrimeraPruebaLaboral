import express from "express";
import axios from "axios";
import { con } from "../database/atlas.js";
import { plainToClass } from "class-transformer";
import { Cellars } from "../storage/cellars.js";
import { ProductDTO } from "../storage/transform.js"
import { limitGrt } from "../limit/config.js";
import { ErrorHandler } from "../storage/errorHandle.js";
import { verifLimiter } from "../middleware/verifLimiter.js";
import { json } from "stream/consumers";

const bodega = express.Router();

bodega.get("/", limitGrt(), verifLimiter, async (req: any, res) => {
  if (!req.rateLimit) return;
  console.log(req.rateLimit);
  let db = await con();
  console.log(db);
  let usuario = db.collection("bodegas");
  let result = await usuario.find({}).toArray();
  res.send(result);
});

bodega.get(
  "/bodegas-ordenadas-alfabeticamente",
  limitGrt(),
  verifLimiter,
  async (req, res) => {
    try {
      const resp = await axios.get("http://localhost:3002/bodegas");
      const toSend = resp.data.sort((a: any, b: any) =>
        a.nombre.localeCompare(b.nombre)
      ); // Obtén los datos de response

      res.json(toSend); // Envía solo los datos relevantes en la respuesta JSON
    } catch (error) {
      console.error(error);
      console.log(error.errInfo.details.schemaRulesNotSatisfied);
      let errorhandl = new ErrorHandler(error);
      res.send(errorhandl.handerErrorSucess);
    }
  }
);

bodega.post("/", limitGrt(), verifLimiter, async (req: any, res) => {
  if (!req.rateLimit) return;
  try {
    var { CREATED_BY, NAME, RESPONSIBLE_NUMBER, STATUS, UPDATED_BY } =
      plainToClass(Cellars, req.body);
    console.log(req.rateLimit);
    let db = await con();
    let bodegas = db.collection("bodegas");
    let result = await bodegas.insertOne({
      nombre: NAME,
      id_responsable: RESPONSIBLE_NUMBER,
      estado: STATUS,
      created_by: CREATED_BY,
      update_by: UPDATED_BY,
    });
    if (!result.insertedId)res.status(500).send(JSON.stringify({"Status":500,"message":"bad"}));
   res.status(201).send(JSON.stringify({"Status":201,"message":"success"}));

  } catch (error) {
    console.error(error);
    if (error.errInfo.details.schemaRulesNotSatisfied) {
      console.log(error.errInfo.details.schemaRulesNotSatisfied);
      let errorhandl = new ErrorHandler(error);
      res.send(errorhandl.handerErrorSucess);
    }else{
      res.status(500).send(JSON.stringify({"status":500,"message":error}))
    }
  }
});

export default bodega;
