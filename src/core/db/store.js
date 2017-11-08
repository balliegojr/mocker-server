
class Collection {
    constructor(){

    }

    insert() { return Promise.reject('Not implemented\n'); }
    exec() { return Promise.reject('Not implemented\n'); }
    remove() { return Promise.reject('Not implemented\n'); }
    update() { return Promise.reject('Not implemented\n'); }
}


class DataStore {
    constructor() {
        
    }

    getCollection(name) { return Promise.reject('Not implemented\n'); }
    ensureCollection(name) { return Promise.reject('Not implemented\n'); } 
    removeCollection(name) { return Promise.reject('Not implemented\n'); }
    ensureIndex(index) { return Promise.reject('Not implemented\n'); }
}

module.exports = {
    Collection,
    DataStore
};