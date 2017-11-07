const db = require('./db');
const ModelStore = require('./modelStore');

class MockedApi {
    constructor(name, singleCollection = false) {
        this._name = name;
        this._singleCollection = singleCollection;

        this._apiName = name;
        if (this._singleCollection) {
            this._apiName = 'mocked-models';
        }
    }

    get(id) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .exec((fn) => fn.findOne({ id: id}))
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

    getFiltered(filter) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .exec((fn) =>  fn.find(filter))
                    .then((response) => resolve(response));
            })
            .catch((err) => reject(err));
        });
    }

    post(obj) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .insert(obj)
                    .then((response) => resolve(response));
            })
            .catch((err) => reject(err));
        });
    }

    put(obj) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .update(obj, { id: obj.id })
                    .then((response) => resolve(response));
            })
            .catch((err) => reject(err));
        });
    }

    delete(obj) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .remove({ id: obj.id })
                    .then((response) => resolve(response));
            })
            .catch((err) => reject(err));
        });
    }
}


class Mocker {
    constructor(options) {
        const _def = (val, def) => { return val === undefined ? def : val; };

        this.singleUser = _def(options.singleUser, true);
        this.strictUrl = _def(options.strictUrl, false);
        this.strictSchema = _def(options.strictSchema, false);
        this.cached = _def(options.cache, false);
        this.ttl = _def(options.ttl, -1);
    }

    getApis() {

    }

    saveApi(api) {

    }

    removeApi(api) {

    }

    getApi(apiName) {
        return new Promise((resolve, reject) => {
            if (this.strictUrl === false){
                return resolve(new MockedApi(apiName));
            }

            var registeredAPis = new ModelStore();
            registeredAPis
                .get(apiName)
                .then(() => resolve(new MockedApi(apiName)))
                .catch(() => reject('Api not found'));
        });
    }
}

module.exports = Mocker;
