import express from "express";
import mysql from "mysql2";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const bodega = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let con = undefined;

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
      (err, data, fils) => {
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

bodega.get("/bodegas-ordenadas-alfabeticamente", (req, res) => {
  const filePath = path.join(__dirname, "./public/dist");
  console.log(filePath);
  res.sendFile(filePath + "/index.html");
});

bodega.post("/", (req, res) => {
  con.query(
    `INSERT INTO bodegas (nombre, id_responsable,estado,created_by,update_by) VALUES (?,?,?,?,?)`,
    [
      req.body.nombre,
      req.body.id_responsable,
      req.body.estado,
      req.body.update_by,
      req.body.created_by,
    ],
    (err, data, fils) => {
      console.log(err);
      console.log(data);
      console.log(fils);
      res.sendStatus(data.affectedRows + 200).send();
    }
  );
});

export default bodega;
