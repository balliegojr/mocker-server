const db = require('./db');

class ModelStore {
    constructor() {
        this._collectionName = 'models';
    }

    _getIndexes() {
        return [
            { field: 'name', unique: true, ttl: 0 }
        ]
    }

    ensureIndexes() {
        let _indexes = this._getIndexes();
        for (var index in _indexes) {
            db
                .getStore()
                .ensureIndex(this._collectionName, _indexes[index]);
        }
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

    insert(modelName) {
        return new Promise((resolve, reject) => {
            db
                .getStore()
                .getCollection(this._collectionName)
                .then((collection) => {
                    return collection.insert({ name: modelName, created: new Date(), count: 0 })
                        .then((response) => {
                            if (!response) {
                                throw new Error('Error inserting model: ' + modelName);
                            } else {
                                resolve(response);
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

    remove(modelName) {
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
                            }
                            else if (response.count > 0) {
                                reject('There are registers to this model, remove them manually or use force remove');
                            }
                            else {
                                return collection.remove(response);
                            }

                        });
                })
                .then(resolve)
                .catch((err) => reject(err));
        });
    }

    forceRemove(modelName) {
        return new Promise((resolve, reject) => {
            db
                .getStore()
                .getCollection(this._collectionName)
                .then((collection) => {
                    return collection
                        .remove({ name: modelName })
                        .then((response) => {
                            if (!response) {
                                reject('Not found');
                            }

                            resolve(response);
                        });
                })
                .then(resolve)
                .catch((err) => reject(err));
        });
    }
}

module.exports = ModelStore;
