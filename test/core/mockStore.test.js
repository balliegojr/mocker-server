const config = require('../testconfig');
const core = require('../../src/core');
const expect = require('chai').expect;
const db_store = require('../../src/core/db').getStore();

describe('modelStore', () =>{
    let _store;
    beforeEach(() => {
        _store = core.getMockStore();
        core.ensureIndexes();
    });

    afterEach(() => {
        db_store.removeCollection(core.getModelStore()._collectionName);
        db_store.removeCollection('model-test');
    });

    describe('getApi method', () => {
        it('should exist', () => expect(_store.getApi).to.be.a('function'));

        it('should return a mocked api for any url', () => {
            return _store
                .getApi('model-test')
                .then((api) => expect(api).to.exist);
        });

        describe('when strict url is true', () => {
            before(() => config.set('mocker.strictUrl', true));
            after(() => config.set('mocker.strictUrl', false));

            it('should return a registered api', () => {
                return core.getModelStore()
                    .insert('model-test')
                    .then(() => core.getMockStore().getApi('model-test'))
                    .then((api) => expect(api).to.exist);
            });
    
            it('should fail if an api is not registered', () => {
                return core.getMockStore()
                    .getApi('model-test')
                    .catch((res) => expect(res).to.equal("Api not found"));
            });
        });

        describe('mocked api', () => {
            let apiName = 'model-test';
            describe('get method', () => {
                it('should exist', () => { 
                    return _store.getApi(apiName).then((api) => expect(api.get).to.be.a('function'));
                });

                it('should return an item by its id', () => {
                    let id = 'exclusive-id';

                    return db_store.getCollection(apiName)
                        .then((collection) => collection.insert({ _id: id, field: 'field-content'}))
                        .then(() => _store.getApi(apiName))
                        .then((api) => api.get(id))
                        .then((item) => {
                            expect(item._id).to.not.exist;
                            expect(item.id).to.equal(id);
                            expect(item.field).to.equal('field-content');
                        });
                });

                it('should throw Not Found for inexistent items', () => {
                    let id = 'exclusive-id';

                    return _store.getApi(apiName)
                        .then((api) => api.get(id))
                        .then((item) => { throw new Error("Should not succeed")})
                        .catch((res) => expect(res).to.equal('Not found'));
                });
            });

            describe('getFiltered method', () => {
                it('should exist', () => { 
                    return _store.getApi(apiName).then((api) => expect(api.getFiltered).to.be.a('function'));
                });

                it('should return an empty array if no itens are found', () => {
                    return _store.getApi(apiName)
                        .then((api) => api.getFiltered({}))
                        .then((res) => {
                            expect(res).to.length(0);
                        });
                });

                it('should return an array with filtered items', () => {
                    expect(true).to.equal(false);
                })
            });

            describe('post method', () => {
                it('should exist', () => { 
                    return _store.getApi(apiName).then((api) => expect(api.post).to.be.a('function'));
                });

                it('should store a new item in the database', () => {
                    return _store.getApi(apiName)
                        .then((api) => {
                            return api.post({ id: 1, field: 'test field', 'field-two': 'test field two' });
                        })
                        .then((res) => {
                            expect(res._id).to.not.exist;
                            expect(res.id).to.equal(1);
                            expect(res.field).to.equal('test field');
                            expect(res['field-two']).to.equal('test field two');

                            return db_store.getCollection(apiName)
                                .then((collection) => collection.exec((fn) => fn.findOne({ _id: 1})))
                                .then((db_res) => {
                                    expect(db_res.id).to.not.exist;
                                    expect(db_res).to.exist;
                                    expect(db_res.field).to.equal(res.field);
                                });
                        });
                    
                });
            });

            describe('put method', () => {
                it('should exist', () => { 
                    return _store.getApi(apiName).then((api) => expect(api.put).to.be.a('function'));
                });

                it('should update an existent item', () => {
                    let id = 'exclusive-id';
                    return db_store.getCollection(apiName)
                        .then((collection) => collection.insert({ _id: id, field: "current value"}))
                        .then(() => _store.getApi(apiName))
                        .then((api) => api.put(id, { id: id, field: 'new value', fieldTwo: 'another new value' }))
                        .then((res) => {
                            expect(res.id).to.equal(id);
                            expect(res.field).to.equal('new value');
                            expect(res.fieldTwo).to.equal('another new value');

                            return db_store.getCollection(apiName);
                        })
                        .then((collection) => collection.exec((fn) => fn.findOne({ _id: id})))
                        .then((res) => {
                            expect(res._id).to.equal(id);
                            expect(res.field).to.equal('new value');
                            expect(res.fieldTwo).to.equal('another new value');
                        });

                });

                it('should fail if the item isnt found', () => {
                    let id = 'exclusive-id';
                    return _store.getApi(apiName)
                        .then((api) => api.put(id, { id: id, field: 'new value', fieldTwo: 'another new value' }))
                        .then((res) => { throw Error('Should not succeed'); })
                        .catch((err) => { expect(err).to.equal('Not found'); });
                });
            });

            describe('delete method', () => {
                it('should exist', () => { 
                    return _store.getApi(apiName).then((api) => expect(api.delete).to.be.a('function'));
                });

                it('should delete an existent item', () => {
                    let id = 'exclusive-id';
                    return db_store.getCollection(apiName)
                        .then((collection) => collection.insert({ _id: id }))
                        .then(() => _store.getApi(apiName))
                        .then((api) => api.delete(id))
                        .then((res) => {
                            expect(res).to.equal(1);
                            return db_store.getCollection(apiName);
                        })
                        .then((collection) => collection.exec((fn) => fn.count({ _id: id})))
                        .then((res) => {
                            expect(res).to.equal(0);
                        });
                });

                it('should fail if the item isnt found', () => {
                    let id = 'exclusive-id';
                    return _store.getApi(apiName)
                        .then((api) => api.delete(id, { id: id }))
                        .then((res) => { throw Error('Should not succeed'); })
                        .catch((err) => { expect(err).to.equal('Not found'); });
                });
            });
        });
    });

});
