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
import { limitGrt } from "../limit/config.js";
import { con } from "../database/atlas.js";
import { verifLimiter } from "../middleware/verifLimiter.js";
import { ErrorHandler } from "../storage/errorHandle.js";
import { plainToClass } from "class-transformer";
import { Products } from "../storage/products.js";
const productos = express.Router();
var insertIds;
productos.get("/ordenados-descendente ", limitGrt(), verifLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.rateLimit)
        return;
    console.log(req.rateLimit);
    var db = yield con();
    console.log(db);
    db.productos.aggregate([
        {
            $lookup: {
                from: "inventarios",
                localField: "id",
                foreignField: "id_producto",
                as: "inventarios"
            }
        },
        {
            $unwind: "$inventarios"
        },
        {
            $group: {
                _id: "$id",
                producto: { $first: "$$ROOT" },
                Total: { $sum: "$inventarios.cantidad" }
            }
        },
        {
            $sort: { Total: -1 }
        },
        {
            $limit: 100
        },
        {
            $replaceRoot: { newRoot: "$producto" }
        }
    ]);
}));
productos.post("/insertar-producto", limitGrt(), verifLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.rateLimit)
        return;
    console.log(req.rateLimit);
    var db = yield con();
    console.log(db);
    try {
        var dataReq = plainToClass(Products, req.body);
        console.log(dataReq);
    }
    catch (error) {
        console.error(error);
    }
    try {
        try {
            db.productos.insertOne({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                estado: req.body.estado,
                created_by: req.body.created_by,
                update_by: req.body.update_by
            });
            db.inventarios.insertOne({
                id_bodega: 12,
                id_producto: insertIds,
                cantidad: 100,
                created_by: req.body.created_by,
                update_by: req.body.update_by
            });
        }
        catch (error) {
            console.log(error.errInfo.details.schemaRulesNotSatisfied);
            let errorhandl = new ErrorHandler(error);
            res.send(errorhandl.handerErrorSucess);
        }
    }
    catch (e) {
        console.log(e.errInfo.details.schemaRulesNotSatisfied);
        let errorhandl = new ErrorHandler(e);
        res.send(errorhandl.handerErrorSucess);
    }
}));
export default productos;
