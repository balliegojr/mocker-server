const config = require('../testconfig');

const MockedApi = require('../../src/core/mockedApi');
const core = require('../../src/core');
const expect = require('chai').expect;
const db_store = require('../../src/core/db').getStore();

describe('mocked api', () => {
    
    const api = new MockedApi('model-test');
    beforeEach(() => {
        return core.ensureIndexes();
    });

    afterEach(() => {
        db_store.removeCollection(core.getModelStore()._collectionName);
        db_store.removeCollection(api._apiName);
    });


    describe('get method', () => {
        it('should exist', () => expect(api.get).to.be.a('function'));

        it('should return an item by its id', () => {
            let id = 'exclusive-id';

            return db_store.getCollection(api._apiName)
                .then((collection) => collection.insert({ _id: id, field: 'field-content'}))
                .then(() => api.get(id))
                .then((item) => {
                    expect(item._id).to.not.exist;
                    expect(item.id).to.equal(id);
                    expect(item.field).to.equal('field-content');
                });
        });

        it('should throw Not Found for inexistent items', () => {
            let id = 'exclusive-id';

            return api.get(id)
                .then((item) => { throw new Error("Should not succeed")})
                .catch((res) => expect(res).to.equal('Not found'));
        });
    });

    describe('getFiltered method', () => {
        it('should exist', () => expect(api.getFiltered).to.be.a('function'));

        it('should return an empty array if no items are found', () => {
            return api.getFiltered({})
                .then((res) => {
                    expect(res).to.length(0);
                });
        });

        it('should return an array with filtered items', () => {
            return db_store.getCollection(api._apiName)
                .then((collection) => {
                    collection.insert({ field: 'field-content', otherField: 'content' });
                    collection.insert({ field: 'field-content', otherField: 'another content' });
                    collection.insert({ field: 'field-content', yetAnotherField: 'content' });
                    collection.insert({ field: 'field-content-wrong', yetAnotherField: 'content' });
                })
                .then(() => api.getFiltered({ filtering: { field: 'field-content' }}))
                .then((res) => {
                    expect(res).to.length(3);
                });
        });
    });

    describe('countFiltered method', () => {
        it('should exist', () => expect(api.countFiltered).to.be.a('function'));

        it('should return the count of items that match the filter', () => {
            return api.countFiltered({})
                .then((res) => {
                    expect(res).to.equal(0);

                    return db_store.getCollection(api._apiName);
                })
                .then((collection) => {
                    collection.insert({ field: 'field-content', otherField: 'content' });
                    collection.insert({ field: 'field-content', otherField: 'another content' });
                    collection.insert({ field: 'field-content', yetAnotherField: 'content' });
                    collection.insert({ field: 'field-content-wrong', yetAnotherField: 'content' });
                    
                })
                .then(() => api.countFiltered({ filtering: { field: 'field-content' }}))
                .then((res) => {
                    expect(res).to.equal(3);
                });
        });
    });

    describe('post method', () => {
        it('should exist', () => expect(api.post).to.be.a('function'));

        it('should store a new item in the database', () => {
            return api.post({ id: 1, field: 'test field', 'field-two': 'test field two' })
                .then((res) => {
                    expect(res._id).to.not.exist;
                    expect(res.id).to.equal(1);
                    expect(res.field).to.equal('test field');
                    expect(res._created).to.exist;
                    expect(res['field-two']).to.equal('test field two');

                    return db_store.getCollection(api._apiName)
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
        it('should exist', () => expect(api.put).to.be.a('function'));

        it('should update an existent item', () => {
            let id = 'exclusive-id';
            return db_store.getCollection(api._apiName)
                .then((collection) => collection.insert({ _id: id, field: "current value"}))
                .then(() => api.put(id, { id: id, field: 'new value', fieldTwo: 'another new value' }))
                .then((res) => {
                    expect(res.id).to.equal(id);
                    expect(res.field).to.equal('new value');
                    expect(res.fieldTwo).to.equal('another new value');

                    return db_store.getCollection(api._apiName);
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
            return api.put(id, { id: id, field: 'new value', fieldTwo: 'another new value' })
                .then((res) => { throw Error('Should not succeed'); })
                .catch((err) => { expect(err).to.equal('Not found'); });
        });
    });

    describe('delete method', () => {
        it('should exist', () => expect(api.delete).to.be.a('function'));

        it('should delete an existent item', () => {
            let id = 'exclusive-id';
            return db_store.getCollection(api._apiName)
                .then((collection) => collection.insert({ _id: id }))
                .then(() => api.delete(id))
                .then((res) => {
                    expect(res).to.equal(1);
                    return db_store.getCollection(api._apiName);
                })
                .then((collection) => collection.exec((fn) => fn.count({ _id: id})))
                .then((res) => {
                    expect(res).to.equal(0);
                });
        });

        it('should fail if the item isnt found', () => {
            let id = 'exclusive-id';
            return api.delete(id, { id: id })
                .then((res) => { throw Error('Should not succeed'); })
                .catch((err) => { expect(err).to.equal('Not found'); });
        });
    });
});