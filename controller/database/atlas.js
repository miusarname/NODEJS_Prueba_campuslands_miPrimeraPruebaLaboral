var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config({ path: "../" });
export function con() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uri = process.env.ATLAS_STRCONNECT;
            console.log(uri);
            const client = yield MongoClient.connect(uri);
            console.log(uri);
            return client.db();
        }
        catch (error) {
            return { status: 500, message: error.message };
        }
    });
}
