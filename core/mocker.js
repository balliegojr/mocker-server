const db = require('./db');

class MockedApi {
    constructor(name, singleCollection) {
        this._name = name;
        this._singleCollection = singleCollection;
    }

    get(id) {
        return new Promise((resolve, reject) => { 
            db
            .getStore()
            .getCollection(this._name)
            .then((collection) => { 
                return collection
                    .exec((fn) => { return fn.findOne({ id: id}) })
                    .then((response) => { resolve(response); })
                    .catch((err) => { reject(err); });
            });
        });
    }

    getFiltered(filter) {
        return new Promise((resolve, reject) => { 
            db
            .getStore()
            .getCollection(this._name)
            .then((collection) => { 
                return collection
                    .exec((fn) => { return fn.find({ id: id}) })
                    .then((response) => { resolve(response); })
                    .catch((err) => { reject(err); });
            });
        });
    }

    post() {
        return new Promise((resolve, reject) => { resolve('Hello world\n') });
    }

    put() {
        return new Promise((resolve, reject) => { resolve('Hello world\n') });
    }

    delete() {
        return new Promise((resolve, reject) => { resolve('Hello world\n') });
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
            if (this.strictUrl === true){
                resolve(new MockedApi(apiName));
            } else {
                resolve(new MockedApi(apiName));
            }
        });
    }
}

module.exports = Mocker;