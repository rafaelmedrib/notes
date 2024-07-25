import DBG from 'debug';
const debug = DBG('notes:notes-store');
const error = DBG('notes:error-store');

var _NotesStore;

export async function useModel(model) {
    try {
        let NotesStoreModule = await import(`./notes-${model}.mjs`);
        let NotesStoreClass = NotesStoreModule.default;
        _NotesStore = new NotesStoreClass();
        return _NotesStore;
    } catch (error) {
        throw new Error(`No recognized NotesStore in ${model} because ${error}`);
    }
}

export { _NotesStore as NotesStore };