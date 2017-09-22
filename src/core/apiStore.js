const db = require('./db');

class ApiStore {
    constructor() {
        this._collectionName = 'apis';
    }

    get(apiFilter) {
        return new Promise((resolve, reject) => { 
            db
            .getStore()
            .getCollection(this._collectionName)
            .then((collection) => { 
                return collection
                    .exec((fn) => fn.findOne(apiFIlter))
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
}

module.exports = ApiStore;