import sqlite3 from "sqlite3";
import { AbstractNotesStore, Note } from "./Notes.mjs";

let db;

async function connectDB() {
    if (db) return db;
    const dbfile = process.env.SQLITE_FILE || "notes.sqlite3";
    await new Promise((res, rej) => {
        db = new sqlite3.Database(
            dbfile,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            (err) => {
                if (err) rej(err);
                else res(db);
            }
        );
    });

    return db;
}

export default class SQLITE3NotesStore extends AbstractNotesStore {
    async close() {
        const _db = db;
        db = undefined;
        return _db
            ? new Promise((res, rej) => {
                  _db.close((err) => {
                      if (err) rej(err);
                      else res();
                  });
              })
            : undefined;
    }

    async update(key, title, body) {
        const db = await connectDB();
        const note = new Note(key, title, body);

        await new Promise((res, rej) => {
            db.run("UPDATE notes " + 
                "SET title = ?, body = ? WHERE notekey = ?",
                [title, body, key], (err) => {
                    if (err) return rej(err);
                    res(note);
                }
            )
        });
    }

    async create(key, title, body) {
        const db = await connectDB();
        const note = new Note(key, title, body);

        await new Promise((res, rej) => {
            db.run("INSERT INTO notes (notekey, title, body) " +
                "VALUES (?, ?, ?);", [key, title, body], (err) => {
                    if (err) return rej(err);
                    res(note);
                }
            )
        });
    }

    async read(key) {
        const db = await connectDB();
        const note = await new Promise((res, rej) => {
            db.get("SELECT * FROM notes WHERE notekey = ?", [key], (err, row) => {
                if (err) return rej(err);
                const note = new Note(row.notekey, row.title, row.body);
                res(note);
            });
        });

        return note;
    }

    async destroy(key) {
        const db = await connectDB();
        return await new Promise((res, rej) => {
            db.run("DELETE FROM notes WHERE notekey = ?", [key], (err) => {
                if (err) return rej(err);
                res();
            });
        });
    }

    async keylist() {
        const db = await connectDB();
        const keyz = await new Promise((res, rej) => {
            const keyz = [];
            db.all("SELECT notekey FROM notes", (err, rows) => {
                if (err) return rej(err);
                res(rows.map(row => row.notekey));
            })
        });

        return keyz;
    }

    async count() {
        const db = await connectDB();
        const count = await new Promise((res, rej) => {
            db.get("SELECT COUNT(notekey) as count FROM notes", (err, row) => {
                if (err) return rej(err);
                res(row.count);
            });
        });

        return count;
    }
}
