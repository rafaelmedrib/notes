const _note_key = Symbol('key');
const _note_title = Symbol('title');
const _note_body = Symbol('body');

export class Note {
    constructor(key, title, body) {
        this[_note_key] = key;
        this[_note_title] = title;
        this[_note_body] = body;
    }

    get key() { return this[_note_key]; }
    get title() { return this[_note_title]; }
    set title(title) { this[_note_title] = title; }
    get body() { return this[_note_body]; }
    set body(body) { this[_note_body] = body; }
    get JSON() {
        return JSON.stringify({
            key: this[_note_key],
            title: this[_note_title],
            body: this[_note_body]
        })
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        if(typeof data !== 'object'
            || !data.hasOwnProperty('key')
            || typeof data.key !== 'string'
            || !data.hasOwnProperty('title')
            || typeof data.title !== 'string'
            || !data.hasOwnProperty('body')
            || typeof data.body !== 'string'
        ) {
            throw new Error(`Not a Note: ${json}`);
        }
         
        const note = new Note(data.key, data.title, data.body);
        return note;
    }
}

export class AbstractNotesStore {
    async close() {
        throw new Error('Not implemented');
    }

    async update(key, title, body) {
        throw new Error('Not implemented');
    }

    async create(title, body) {
        throw new Error('Not implemented');
    }

    async read(key) {
        throw new Error('Not implemented');
    }

    async destroy(key) {
        throw new Error('Not implemented');
    }

    async keylist() {
        throw new Error('Not implemented');
    }
}