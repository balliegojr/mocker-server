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
            });

            describe('post method', () => {
                it('should exist', () => { 
                    return _store.getApi(apiName).then((api) => expect(api.post).to.be.a('function'));
                });

                it('should store a new item in the database', () => {
                    return _store.getApi(apiName)
                        .then((api) => {
                            return api.post({ field: 'test field', 'field-two': 'test field two' });
                        })
                        .then((res) => {
                            expect(res._id).to.exist;
                            expect(res.field).to.equal('test field');
                            expect(res['field-two']).to.equal('test field two');

                            return db_store.getCollection(apiName)
                                .then((collection) => collection.exec((fn) => fn.findOne({ _id: res.id})))
                                .then((db_res) => {
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
            });

            describe('delete method', () => {
                it('should exist', () => { 
                    return _store.getApi(apiName).then((api) => expect(api.delete).to.be.a('function'));
                });
            });
        });
    });

});
