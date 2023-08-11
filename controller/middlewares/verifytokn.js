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
import { Router } from "express";
const appMiddlewareCampusVerify = Router();
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
