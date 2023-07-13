var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import mysql from "mysql2";
import axios from "axios";
import { plainToClass } from "class-transformer";
import { Cellars } from "../DTO/cellars.js";
const bodega = express.Router();
let con;
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
    }
    catch (e) {
        res.sendStatus(500);
        res.send(e);
    }
});
bodega.get("/", (req, res) => {
    try {
        con.query(`SELECT * FROM bodegas`, [req.body.nom_com, req.body.edad], (err, data, fils) => {
            console.log(err);
            console.log(data);
            console.log(fils);
            res.send(data);
        });
    }
    catch (e) {
        res.sendStatus(500).send("Ha habido un error...");
    }
});
bodega.get("/bodegas-ordenadas-alfabeticamente", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield axios.get("http://localhost:3002/bodegas");
        const toSend = resp.data.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Obtén los datos de response
        res.json(toSend); // Envía solo los datos relevantes en la respuesta JSON
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
bodega.post("/", (req, res) => {
    try {
        var dataReq = plainToClass(Cellars, req.body);
    }
    catch (error) {
        console.error(error);
    }
    try {
        con.query(`INSERT INTO bodegas (nombre, id_responsable,estado,created_by,update_by) VALUES (?,?,?,?,?)`, [
            dataReq.NAME,
            dataReq.RESPONSIBLE_NUMBER,
            dataReq.STATUS,
            dataReq.UPDATED_BY,
            dataReq.CREATED_BY,
        ], (err, data, fils) => {
            console.log(err);
            console.log(data);
            console.log(fils);
            res.sendStatus(data.affectedRows + 200).send();
        });
    }
    catch (error) {
        console.error(error);
    }
});
export default bodega;
