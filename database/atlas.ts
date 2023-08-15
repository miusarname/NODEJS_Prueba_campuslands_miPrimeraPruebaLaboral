import { MongoClient, Db, MongoClientOptions } from "mongodb";
import dotenv from 'dotenv';

dotenv.config({ path: "../" });

export async function con(): Promise<Db | { status: number; message: string } | any> {
    try {
        const uri = process.env.ATLAS_STRCONNECT;
        console.log(uri)
        const client = await MongoClient.connect(uri);
        console.log(uri)
        return client.db();
    } catch (error) {
        return { status: 500, message: error.message };
    }
}
