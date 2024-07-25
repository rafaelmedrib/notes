import { NotesStore as notes } from '../models/notes-store.mjs'
import { Router } from "express";
const router = Router();

router.get("/", async function (req, res, next) {
    try {
        const keylist = await notes.keylist();

        const notesPromise = keylist.map((key) => notes.read(key));

        const noteslist = await Promise.all(notesPromise);
        res.render("index", {
            title: "Notes",
            noteslist,
        });
    } catch (error) {
        next(error);
    }
});

export { router };
