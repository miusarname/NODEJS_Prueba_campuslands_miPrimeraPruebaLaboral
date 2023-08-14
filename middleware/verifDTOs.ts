import "reflect-metadata";
import { plainToClass, classToPlain } from "class-transformer";
import { validate } from "class-validator";
import { Cellars } from "../storage/cellars";
import { Products } from "../storage/products";
import { Stocktaking } from "../storage/stocktaking";
import { Router } from "express";
export const appDTOData = Router();

appDTOData.use(async (req: any, res, next) => {
  try {
    if (!req.data || !req.data.obj) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const className = req.data.obj;
    const bodyData = req.body;

    const classType = eval(className);
    const data = plainToClass(classType, bodyData);

    const validationErrors = await validate(data);

    if (validationErrors.length > 0) {
      return res.status(400).json({ validationErrors });
    }

    req.body = JSON.parse(JSON.stringify(data));
    req.data = undefined;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
