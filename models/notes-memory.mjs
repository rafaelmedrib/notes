import { AbstractNotesStore, Note } from "./Notes.mjs";

const notes = [];

export default class InMemoryNotesStore extends AbstractNotesStore {
    async close() {
        return;
    }

    async update(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }

    async create(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }

    async read(key) {
        if (!notes[key]) {
            throw new Error(`Note ${key} not found`);
        }
        return notes[key];
    }

    async destroy(key) {
        if (!notes[key]) {
            throw new Error(`Note ${key} not found`);
        }
        delete notes[key];
    }

    async keylist() {
        return Object.keys(notes);
    }

    async count() {
        return notes.length;
    }
}
