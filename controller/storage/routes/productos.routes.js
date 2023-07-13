import express from "express";
import mysql from "mysql2";
import { plainToClass } from 'class-transformer';
import { Products } from '../DTO/products.js';
const productos = express.Router();
let con;
let insertIds;
productos.use((req, res, next) => {
    try {
        con = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE,
        });
        //console.log(con);
        next();
    }
    catch (e) {
        res.sendStatus(500);
        res.send(e);
    }
});
productos.get("/ordenados-descendente", (req, res) => {
    const query = `
  SELECT p.*, SUM(b.cantidad) AS Total
  FROM productos p
  JOIN inventarios b ON p.id = b.id_producto
  GROUP BY p.id
  ORDER BY Total DESC LIMIT 0,100
  `;
    con.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        }
        else {
            res.send(results);
        }
    });
});
productos.post("/insertar-producto", (req, res) => {
    try {
        var dataReq = plainToClass(Products, req.body);
        console.log(dataReq);
    }
    catch (error) {
        console.error(error);
    }
    try {
        con.query(`INSERT INTO productos(nombre,descripcion,estado,created_by,update_by) VALUES (?,?,?,?,?)`, [
            req.body.nombre,
            req.body.descripcion,
            req.body.estado,
            req.body.created_by,
            req.body.update_by,
        ], (err, data, fils) => {
            if (err) {
                //console.log(err);
                res.sendStatus(500);
            }
            else {
                insertIds = data.insertId;
                console.log(data.insertId);
                //console.log(insertId);
            }
        });
    }
    catch (e) {
        res.sendStatus(500);
    }
    try {
        con.query(`INSERT INTO inventarios(id_bodega,id_producto, cantidad,created_by,update_by) VALUES (?,?,?,?,?)`, [
            12,
            insertIds,
            100,
            req.body.created_by,
            req.body.update_by
        ], (err, data, fils) => {
            console.log(err);
            console.log(data);
            console.log(fils);
        });
        res.sendStatus(200).send();
    }
    catch (e) {
        res.sendStatus(500);
    }
});
export default productos;
