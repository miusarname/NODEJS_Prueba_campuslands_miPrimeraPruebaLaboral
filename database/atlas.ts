import { MongoClient, Db, MongoClientOptions } from "mongodb";
import dotenv from 'dotenv';

dotenv.config({ path: "../" });

export async function con(): Promise<Db | { status: number; message: string }> {
    try {
        const uri = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.ap9ecpy.mongodb.net/${process.env.ATLAS_DB}`;;
        const client = await MongoClient.connect(uri);
        return client.db();
    } catch (error) {
        return { status: 500, message: error.message };
    }
}
