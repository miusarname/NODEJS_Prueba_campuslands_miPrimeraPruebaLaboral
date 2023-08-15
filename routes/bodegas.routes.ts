import express from "express";
import axios from "axios";
import { con } from "../database/atlas.js";
import { plainToClass } from "class-transformer";
import { Cellars } from "../storage/cellars.js";
import { limitGrt } from "../limit/config.js";
import { verifLimiter } from "../middleware/verifLimiter.js";

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
      res.status(500).json({ error: "Internal Server Error" });
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
  res.send(result);
  } catch (error) {
    console.error(error);
    res.status(error.status).send(error)
  }
});

export default bodega;
