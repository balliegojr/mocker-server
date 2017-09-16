const DataStore = require('nedb');
const _store = require('./store');
const fs = require('fs');
const path = require('path');

    
var promisifyDb = function(obj) {
    return new Promise(function(resolve, reject) {
        obj.exec(function(error, result) {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    });
};


function promisifyDatastore(datastore) {
    var store = {
        insert: Q.nbind(datastore.insert, datastore),
        update: Q.nbind(datastore.update, datastore),
        remove: Q.nbind(datastore.remove, datastore),
        exec: function(fn){
            return promisifyDb(fn(datastore))
        }
    };

    return store;
}

class NedbCollection extends _store.Collection {
    constructor() {
        super();
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