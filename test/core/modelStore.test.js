const config = require('../testconfig');
const modelStore = require('../../src/core/modelStore');
const expect = require('chai').expect;
const db_store = require('../../src/core/db').getStore();

describe('modelStore', function(){
    let _store;
    beforeEach(() => {
        _store = new modelStore();
        _store.ensureIndexes();
        //db_store.ensureCollection(_store._collectionName);
    });

    afterEach(() => {
        db_store.removeCollection(_store._collectionName);
    });

    describe('get method', function(){
        it('should exist', function(){
            expect(_store.get).to.be.a('function');
        });

        it('should return an existent model', () => {
            return _store.insert('test-model')
                .then((model) => _store.get(model.name))
                .then((model) => {
                    expect(model.name).to.equal('test-model');
                    expect(model._id).to.exist;
                });
        });

        it('Should throw an error for inexistent model', () => {
            return _store.get('test-model')
                .then(() => { throw Error("Should not succeed") })
                .catch((res) => {
                    expect(res).to.equal('Not found');
                });
        });
    });

    describe('insert method', function(){
        it('should exist', function(){
            expect(_store.insert).to.be.a('function');
        });
        
        it('should insert a new model', () => {
            return _store.insert('test-model').then((model) => {
                expect(model.name).to.equal('test-model');
                expect(model._id).to.exist;
                expect(model.count).to.equal(0);
                expect(model.created).to.exist;
            });
        });

        it('should not insert two models with the same name', () => {
            return _store.insert('test-model')
                .then((model) => _store.insert(model.name))
                .then(() => { throw Error('Should not succeed'); })
                .catch((res) => {
                    expect(res).to.equal('Model already exists');
                });
        });
    });

    
    describe('remove method', function(){
        it('should exist', function(){
            expect(_store.remove).to.be.a('function');
        });

        it('should remove an existent record', () => {
            return _store.insert('test-model')
                .then(() => _store.remove('test-model'))
                .then((res) => expect(res).to.equal(1));
        });

        it('should return an error when trying to remove an inexistent model', () => {
            return _store.remove('test-model')
                .catch((res) => expect(res).to.equal('Not found'));
        });

        it('Should not remove a model with register count greater than 0', () => {
            return _store.insert('test-model')
                .then((model) => {
                    model.count = 10;

                    return db_store
                        .getCollection(_store._collectionName)
                        .then((collection) => collection.update(model));
                        
                })
                .then(() => _store.remove('test-model'))
                .then(() => { throw Error('Should not succeed'); })
                .catch((res) => expect(res).to.equal('There are registers to this model, remove them manually or use force remove'));
        });
    });

    describe('forceRemove method', function(){
        it('should exist', function(){
            expect(_store.forceRemove).to.be.a('function');
        });

        it('should remove an existent model regardless it register count', () => {
            return _store.insert('test-model')
            .then((model) => {
                model.count = 10;

                return db_store
                    .getCollection(_store._collectionName)
                    .then((collection) => collection.update(model));
            })
            .then(() => _store.forceRemove('test-model'))
            .then((res) => expect(res).to.equal(1));
        });

        it('should return an error when trying to remove an inexistent model', () => {
            return _store.forceRemove('test-model')
                .then((res) => { throw Error('Should not succeed'); })
                .catch((res) => expect(res).to.equal('Not found'));
        });

    });

});
