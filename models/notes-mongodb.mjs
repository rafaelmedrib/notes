import { Note, AbstractNotesStore } from "./Notes.mjs";
import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;

let client;

const connectDB = async () => {
    if (!client) client = await MongoClient.connect(process.env.MONGO_URL);
};

const db = () => {
    return client.db(process.env.MONGO_DBNAME);
};

export default class MongoDBNotesStore extends AbstractNotesStore {
    async close() {
        if (client) client.close();
        client = undefined;
    }

    async update(key, title, body) {
        await connectDB();
        const note = new Note(key, title, body);
        const collection = db().collection("notes");
        await collection.updateOne(
            { notekey: key },
            {
                $set: {
                    title,
                    body,
                },
            }
        );

        return note;
    }

    async create(key, title, body) {
        await connectDB();
        const note = new Note(key, title, body);
        const collection = db().collection("notes");
        await collection.insertOne({
            notekey: key,
            title,
            body,
        });

        return note;
    }

    async read(key) {
        await connectDB();
        const collection = db().collection("notes");
        const doc = await collection.findOne({ notekey: key });
        const note = new Note(doc.notekey, doc.title, doc.body);
        return note;
    }

    async destroy(key) {
        await connectDB();
        const collection = db().collection("notes");
        const doc = await collection.findOne({ notekey: key });
        if(!doc) {
            throw new Error(`No not found for key ${key}`);
        } else {
            await collection.findOneAndDelete({ notekey: key });
        }
    }

    async keylist() {
        await connectDB();
        const collection = db().collection("notes");
        const keyz = await new Promise((res, rej) => {
            const keyz = [];
            collection.find({}).forEach(
                note => {
                    keyz.push(note.notekey);
                },
                err => {
                    if (err) return rej(err);
                    
                    res(keyz);
                }
            );
        });

        return keyz;
    }

    async count() {
        await connectDB();
        const collection = db().collection("notes");
        const count = await collection.count({});
        return count;
    }
}
