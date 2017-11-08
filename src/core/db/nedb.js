const DataStore = require('nedb');
const _store = require('./store');
const fs = require('fs');
const path = require('path');
const extend = require('util')._extend;

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
    constructor(path, options) {
        super();
        this._path = path;
        this._options = options || {};
    }

    ensureCollection(collection) {
        if (_collections[collection]){
            return _collections[collection];
        }

        let options = extend(this._options, {
            filename: path.join(this._path, collection + '.db'),
            autoload: true
        });

        var _dataStore = new DataStore(options);
        return _collections[collection] = new NedbCollection(_dataStore);
    }

    removeCollection(collection) {
        if (_collections[collection]){
            delete _collections[collection];
        }

        if (fs.existsSync(path.join(this._path, collection + '.db'))){
            fs.unlinkSync(path.join(this._path, collection + '.db'));
        }
    }

    getCollection(collection) {
        return new Promise((resolve, reject) => {
            if (!_collections[collection]){
                let options = extend(this._options, {
                    filename: path.join(this._path, collection + '.db'),
                    autoload: true
                });

                _collections[collection] = new NedbCollection(
                    new DataStore(options)
                );    
            }

            resolve(_collections[collection]);
        });
    }
}


module.exports = Nedb;