import express from "express";
import mysql from "mysql2";
import axios from "axios";
import { plainToClass } from "class-transformer";
import { Cellars } from "../DTO/cellars.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const bodega = express.Router();

let con: any;

bodega.use((req, res, next) => {
  try {
    con = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
    });
    console.log(con);
    next();
  } catch (e) {
    res.sendStatus(500);
    res.send(e);
  }
});

bodega.get("/", (req, res) => {
  try {
    con.query(
      `SELECT * FROM bodegas`,
      [req.body.nom_com, req.body.edad],
      (err: any, data: any, fils: any) => {
        console.log(err);
        console.log(data);
        console.log(fils);
        res.send(data);
      }
    );
  } catch (e) {
    res.sendStatus(500).send("Ha habido un error...");
  }
});

bodega.get("/bodegas-ordenadas-alfabeticamente", async (req, res) => {
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
});

bodega.post("/", (req, res) => {
  try {
    var dataReq: any = plainToClass(Cellars, req.body);
  } catch (error) {
    console.error(error);
  }
  try {
    con.query(
      `INSERT INTO bodegas (nombre, id_responsable,estado,created_by,update_by) VALUES (?,?,?,?,?)`,
      [
        dataReq.NAME,
        dataReq.RESPONSIBLE_NUMBER,
        dataReq.STATUS,
        dataReq.UPDATED_BY,
        dataReq.CREATED_BY,
      ],
      (err: any, data: any, fils: any) => {
        console.log(err);
        console.log(data);
        console.log(fils);
        res.sendStatus(data.affectedRows+200).send();
      }
    );
  } catch (error) {
    console.error(error);
  }
});

export default bodega;
