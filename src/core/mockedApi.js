const db = require('./db');

class MockedApi {
    constructor(name, singleCollection = false) {
        this._name = name;
        this._singleCollection = singleCollection;

        this._apiName = name;
        if (this._singleCollection) {
            this._apiName = 'mocked-models';
        }
    }

    toStoreFormat(obj){
        if (Object.prototype.hasOwnProperty.call(obj, 'id')){
            obj._id = obj.id;
            delete obj.id;
        }

        return obj;
    };

    fromStoreFormat(obj) {
        if (Object.prototype.hasOwnProperty.call(obj, '_id')){
            obj.id = obj._id;
            delete obj._id;
        }

        return obj;
    }

    get(id) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .exec((fn) => fn.findOne({ _id: id}))
                    .then((response) => {
                        if (!response) {
                            reject('Not found');
                        } else {
                            resolve(this.fromStoreFormat(response));
                        }
                    });
            })
            .catch((err) => reject(err));
        });
    }

    getFiltered(filterOptions) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .exec((store, filter) =>  store.find(filter), filterOptions)
                    .then((response) => resolve((response || []).map(x => this.fromStoreFormat(x))));
            })
            .catch((err) => reject(err));
        });
    }

    countFiltered(filterOptions) {
        delete filterOptions.pagination;
        delete filterOptions.sorting;

        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .exec((fn, filter) =>  fn.count(filter), filterOptions)
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
                    .insert(this.toStoreFormat(obj))
                    .then((response) => resolve(this.fromStoreFormat(response)));
            })
            .catch((err) => reject(err));
        });
    }

    put(id, obj) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                obj.id = id;
                let _obj = this.toStoreFormat(obj);

                return collection
                    .update(_obj, { _id: id })
                    .then((response) => { 
                        if (response === 0){
                            reject('Not found');
                        } else {
                            resolve(this.fromStoreFormat(obj));
                        }
                    });
            })
            .catch((err) => reject(err));
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db
            .getStore()
            .getCollection(this._apiName)
            .then((collection) => {
                return collection
                    .remove({ _id: id })
                    .then((response) => response === 0 ? reject('Not found') : resolve(response));
            })
            .catch((err) => reject(err));
        });
    }
}

module.exports = MockedApi;