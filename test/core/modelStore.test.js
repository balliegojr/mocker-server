const config = require('../testconfig');
const core = require('../../src/core');
const expect = require('chai').expect;
const db_store = require('../../src/core/db').getStore();

describe('modelStore', function(){
    let _store;
    beforeEach(() => {
        _store = core.getModelStore();
        _store.ensureIndexes();
    });

    afterEach(() => {
        db_store.removeCollection(_store._collectionName);
    });

    describe('get method', function(){
        it('should exist', function(){
            expect(_store.get).to.be.a('function');
        });

        it('should return an existent model', () => {
            return _store.insert({ name: 'test-model'})
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


    describe('getAll method', () => {
        it('should exist', () => expect(_store.getAll).to.be.a('function'));

        it('should return all existent model', () => {
            return 
                _store.insert({ name: 'test-model'})
                .then(() => _store.insert({ name: 'test-model-2'}))
                .then(() => _store.insert({ name: 'test-model-3'}))
                .then((model) => _store.getAll())
                .then((models) => {
                    expect(models).to.have.length(3);
                    
                    
                });
        });

        it('should return an empty array', () => {
            return _store.getAll()
                .then((response) => expect(response).to.have.length(0));
                
        });
    });

    describe('insert method', function(){
        it('should exist', function(){
            expect(_store.insert).to.be.a('function');
        });
        
        it('should insert a new model', () => {
            return _store.insert({ name: 'test-model'}).then((model) => {
                expect(model.name).to.equal('test-model');
                expect(model._id).to.exist;
                expect(model.created).to.exist;
            });
        });

        it('should not insert two models with the same name', () => {
            return _store.insert({ name: 'test-model' })
                .then((model) => _store.insert({ name: model.name }))
                .then(() => { throw Error('Should not succeed'); })
                .catch((res) => {
                    expect(res).to.equal('Model already exists');
                });
        });
    });

    
    describe('delete method', function(){
        it('should exist', function(){
            expect(_store.delete).to.be.a('function');
        });

        it('should delete an existent record', () => {
            return _store.insert({ name: 'test-model' })
                .then(() => _store.delete('test-model'))
                .then((res) => expect(res).to.equal(1));
        });

        it('should return an error when trying to delete an inexistent model', () => {
            return _store.delete('test-model')
                .catch((res) => expect(res).to.equal('Not found'));
        });

    });

});
