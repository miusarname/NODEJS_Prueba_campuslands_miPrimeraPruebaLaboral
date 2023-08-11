var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Router } from "express";
const appDTOData = Router();
appDTOData.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = plainToClass(User, req.body);
        yield validate(data);
        req.body = JSON.parse(JSON.stringify(data));
        req.data = undefined;
        next();
    }
    catch (err) {
        res.status(err.status).send(err);
    }
}));
