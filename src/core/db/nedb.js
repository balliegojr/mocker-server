const DataStore = require('nedb');
const _store = require('./store');
const fs = require('fs');
const path = require('path');

class NedbCollection extends _store.Collection {
    constructor(_store) {
        super();

        this._store = _store;
    }

    exec(fn) {
        return new Promise((resolve, reject) => {
            fn(this._store)
            .exec((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    insert(obj) {
        return new Promise((resolve, reject) => {
            this._store.insert(obj, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    update(obj, query) {
        if (!query) {
            query = {
                _id: obj._id
            };
        }

        return new Promise((resolve, reject) => {
            this._store.insert(query, obj, {}, (err, numReplaced) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    remove(query) {
        return new Promise((resolve, reject) => {
            this._store.remove(query, (err, numRemoved) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}

const _collections = {};

class Nedb extends _store.DataStore {
    constructor(path) {
        super();
        this._path = path;
    }

    ensureCollection(collection, options) {
        if (_collections[collection]){
            return _collections[collection];
        }

        var _dataStore = new DataStore({
            filename: path.join(this._path, 'data/'+ collection +'.db'),
            autoload: true
        });
        
        if (options.index){
            _dataStore.ensureIndex(options.index);
        }

        return _collections[collection] = new NedbCollection(_dataStore);
    }

    removeCollection(collection) {
        if (_collections[collection]){
            delete _collections[collection];
        }

        fs.unlinkSync(path.join(this._path, 'data/' + collection + '.db'));
    }

    getCollection(collection) {
        return new Promise((resolve, reject) => {
            if (!_collections[collection]){
                _collections[collection] = new NedbCollection(
                    new DataStore({
                        filename: path.join(this._path, 'data/'+ collection +'.db'),
                        autoload: true
                    })
                );    
            }

            resolve(_collections[collection]);
        });
    }
}


module.exports = Nedb;