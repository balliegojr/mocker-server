const db = require('./db');

class ModelStore {
    constructor(default_ttl) {
        this._collectionName = 'models';
        this._default_ttl = default_ttl;
    }

    _getIndexes() {
        return [
            { field: 'name', unique: true, ttl: 0 }
        ]
    }

    _createIndexForModel(model) {
        return db
            .getStore()
            .ensureIndex(model.name, { field:'_created', unique: true, ttl: model.ttl || this.default_ttl });
    }

    ensureIndexes() {
        return Promise.all(this._getIndexes().map((index) => {
            return db
            .getStore()
            .ensureIndex(this._collectionName, index)
        }))
        .then(() => {
            return this.getAll().then((models) => {
                Promise.all(models
                    .filter(model => (model.ttl || this._default_ttl) > 0)
                    .map((model) => this._createIndexForModel(model)));
            });
        });
    }

    get(modelName) {
        return new Promise((resolve, reject) => {
            db
                .getStore()
                .getCollection(this._collectionName)
                .then((collection) => {
                    return collection
                        .exec((fn) => fn.findOne({ name: modelName }))
                        .then((response) => {
                            if (!response) {
                                reject('Not found');
                            } else {
                                resolve(response);
                            }
                        });
                })
                .catch((err) => reject(err));
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            db
                .getStore()
                .getCollection(this._collectionName)
                .then((collection) => {
                    return collection
                        .exec((fn) => fn.find({ }))
                        .then((response) => resolve(response));
                })
                .catch((err) => reject(err));
        });
    }

    insert(model) {
        return new Promise((resolve, reject) => {
            db
                .getStore()
                .getCollection(this._collectionName)
                .then((collection) => {
                    return collection.insert({ name: model.name, created: new Date(), ttl: model.ttl || this._default_ttl })
                        .then((response) => {
                            if (!response) {
                                throw new Error('Error inserting model: ' + model.name);
                            } else {
                                resolve(response);
                                _createIndexForModel(response);
                            }
                        });
                })
                .catch((err) => {
                    if (/unique constraint/gi.test(err)){
                        reject ("Model already exists");
                    } else {
                        reject(err);
                    }
                });
        });
    }

    delete(modelName) {
        return new Promise((resolve, reject) => {
            db
                .getStore()
                .getCollection(this._collectionName)
                .then((collection) => {
                    return collection
                        .remove({ name: modelName })
                })
                .then((response) => {
                    if (response <= 0){
                        reject('Not found');
                    } else {
                        resolve(response);
                    }
                })
                .catch((err) => reject(err));
        });
    }
}

module.exports = ModelStore;
