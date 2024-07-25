import { Router } from "express";
import { NotesStore as notes } from '../models/notes-store.mjs'
export const notesRouter = Router();

notesRouter.get('/add', (req, res, next) => {
    res.render('noteedit', {
        title: 'Add a Note',
        docreate: true,
        notekey: '',
        note: undefined,
    });
});

notesRouter.post('/save', async (req, res, next) => {
    try {
        const { docreate, notekey, title, body } = req.body;
        if (docreate) {
            await notes.create(notekey, title, body);
        } else {
            await notes.update(notekey, title, body);
        }

        res.redirect('/notes/view?key=' + notekey);
    } catch (error) {
        next(error);
    }
});

notesRouter.get('/view', async (req, res, next) => {
    try {
        const notekey = req.query.key;
        const note = await notes.read(notekey);
        res.render('noteview', {
            title: note.title,
            notekey,
            note,
        });
    } catch (error) {
        next(error);
    }
});

notesRouter.get('/edit', async (req, res, next) => {
    try {
        const notekey = req.query.key;
        const note = await notes.read(notekey);
        res.render('noteedit', {
            title: note ? ('Edit ' + note.title) : 'Add a Note',
            docreate: false,
            notekey,
            note,
        })
    } catch (error) {
        next(error);
    }
});

notesRouter.get('/destroy', async (req, res, next) => {
    try {
        const notekey = req.query.key;
        const note = await notes.read(notekey);
        res.render('notedestroy', {
            title: note ? `Delete ${note.title}` : '',
            notekey,
            note,
        })
    } catch (error) {
        next(error);
    }
});

notesRouter.post('/destroy/confirm', async (req, res, next) => {
    try {
        const notekey = req.body.notekey;
        await notes.destroy(notekey);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
});