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
const inventarios = express.Router();
let connection;
inventarios.post("/", limitGrt(), verifLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_producto, id_bodega, cantidad } = req.body;
    if (!req.rateLimit)
        return;
    console.log(req.rateLimit);
    var db = yield con();
    console.log(db);
    try {
        // Verificar si la combinación de bodega y producto ya existe
        const [existingInventory] = db.inventarios.find({
            id_producto: id_producto,
            id_bodega: id_bodega,
        }, {
            _id: 0,
            id: 1,
            cantidad: 1,
        });
        if (existingInventory.length === 0) {
            // Combinación nueva, realizar un INSERT
            db.inventarios.insertOne({
                id_producto: id_producto,
                id_bodega: id_bodega,
                cantidad: cantidad
            });
        }
        else {
            // Combinación existente, realizar un UPDATE
            const updatedQuantity = existingInventory[0].cantidad + cantidad;
            db.inventarios.updateOne({ id: existingInventory[0].id }, {
                $set: { cantidad: updatedQuantity }
            });
        }
        res.status(200).json({ message: "Registro insertado correctamente" });
    }
    catch (error) {
        console.error("Error al insertar en la tabla de inventarios:", error);
        console.log(error.errInfo.details.schemaRulesNotSatisfied);
        let errorhandl = new ErrorHandler(error);
        res.send(errorhandl.handerErrorSucess);
    }
}));
inventarios.put("/traslados", limitGrt(), verifLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_producto, id_bodega_origen, id_bodega_destino, cantidad } = req.body;
    if (!req.rateLimit)
        return;
    console.log(req.rateLimit);
    var db = yield con();
    console.log(db);
    try {
        // Verificar si la cantidad solicitada se puede extraer de la bodega de origen
        const [originInventory] = db.inventarios.find({
            id_producto: id_producto,
            id_bodega: id_bodega_origen
        }, {
            _id: 0,
            id: 1,
            cantidad: 1
        });
        if (!originInventory ||
            originInventory.length === 0 ||
            originInventory[0].cantidad < cantidad) {
            res
                .status(400)
                .json({
                message: "No hay suficientes unidades en la bodega de origen",
            });
            return;
        }
        // Realizar el traslado
        const updatedOriginQuantity = originInventory[0].cantidad - cantidad;
        const [destinationInventory] = db.inventarios.find({
            id_producto: id_producto,
            id_bodega: id_bodega_destino
        }, {
            _id: 0,
            id: 1,
            cantidad: 1
        });
        if (destinationInventory && destinationInventory.length > 0) {
            // Actualizar el inventario de destino
            const updatedDestinationQuantity = destinationInventory[0].cantidad + cantidad;
            db.inventarios.updateOne({ id: destinationInventory[0].id }, {
                $set: { cantidad: updatedDestinationQuantity }
            });
        }
        else {
            // Insertar un nuevo registro en el inventario de destino
            db.inventarios.insertOne({
                id_producto: id_producto,
                id_bodega: id_bodega_destino,
                cantidad: cantidad
            });
        }
        // Actualizar el inventario de origen
        yield connection.query("UPDATE inventarios SET cantidad = ? WHERE id = ?", [
            updatedOriginQuantity,
            originInventory[0].id,
        ]);
        // Insertar registro en la tabla de historiales
        db.historiales.insertOne({
            cantidad: cantidad,
            id_bodega_origen: id_bodega_origen,
            id_bodega_destino: id_bodega_destino,
            id_inventario: originInventory[0].id
        });
        res.status(200).json({ message: "Traslado realizado correctamente" });
    }
    catch (error) {
        console.error("Error al realizar el traslado:", error);
        console.log(error.errInfo.details.schemaRulesNotSatisfied);
        let errorhandl = new ErrorHandler(error);
        res.send(errorhandl.handerErrorSucess);
    }
}));
export default inventarios;
