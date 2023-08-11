var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import 'reflect-metadata';
import { plainToClass, classToPlain } from 'class-transformer';
import { validate } from 'class-validator';
import { Router } from "express";
const appMiddlewareCampusVerify = Router();
const appDTOData = Router();
appMiddlewareCampusVerify.use((req, res, next) => {
    if (!req.rateLimit)
        return;
    let { payload } = req.data;
    const { iat, exp } = payload, newPayload = __rest(payload, ["iat", "exp"]);
    payload = newPayload;
    let Clone = JSON.stringify(classToPlain(plainToClass(User, {}, { ignoreDecorators: true })));
    let Verify = Clone === JSON.stringify(payload);
    (!Verify) ? res.status(406).send({ status: 406, message: "No Autorizado" }) : next();
});
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
export { appMiddlewareCampusVerify, appDTOData };
