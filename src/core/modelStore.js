const db = require('./db');

class ModelStore {
    constructor() {
        this._collectionName = 'models';
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

    create(modelName) {
      return new Promise((resolve, reject) => {
          db
          .getStore()
          .getCollection(this._collectionName)
          .then((collection) => {
                return collection
                collection.insert({name: modelName, created: new Date(), count: 0 })
                .then((response) => {
                    if (!response) {
                        reject('Error inserting model: ' + modelName);
                    } else {
                        resolve(response);
                    }
                });
          })
          .catch((err) => reject(err));
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
                        else if (response.count > 0){
                            reject('There are registers to this model, remove them manually or use force remove');
                        }
                        else {
                            return collection.remove(response);
                        }

                    });
            })
            .catch((err) => reject(err));
        });
    }

    forceRemove(modelName) {

    }
}

module.exports = ModelStore;
