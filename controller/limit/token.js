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
import { plainToClass, classToPlain } from 'class-transformer';
import dotenv from 'dotenv';
import { Router } from 'express';
import { SignJWT, jwtVerify } from 'jose';
dotenv.config({ path: "../" });
const appToken = Router();
const appVerify = Router();
appToken.use("/:collecion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let inst = plainToClass(eval(req.params.collecion), {}, { ignoreDecorators: true });
        console.log(inst);
        const encoder = new TextEncoder();
        const jwtconstructor = new SignJWT(Object.assign({}, classToPlain(inst)));
        const jwt = yield jwtconstructor
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("30m")
            .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
        req.data = jwt;
        res.status(201).send({ status: 201, message: jwt });
    }
    catch (error) {
        res.status(404).send({ status: 404, message: "Token solicitado no valido" });
    }
}));
appVerify.use("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(400).send({ status: 400, token: "Token no enviado" });
    try {
        const encoder = new TextEncoder();
        const jwtData = yield jwtVerify(authorization, encoder.encode(process.env.JWT_PRIVATE_KEY));
        req.data = jwtData;
        next();
    }
    catch (error) {
        res.status(498).send({ status: 498, token: "Token caducado" });
    }
}));
export { appToken, appVerify };
