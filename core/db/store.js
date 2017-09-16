
class Collection {
    constructor(){

    }

    insert() { }

    exec() { }

    remove() { }

    update() { }
}


class DataStore {
    constructor() {
        
    }

    getCollection(name) {
    }

    ensureCollection(name, options) {
    }

    removeCollection(name) {
    }
}

module.exports = {
    Collection,
    DataStore
};