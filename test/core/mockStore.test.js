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
                    .insert({ name: 'model-test' })
                    .then(() => core.getMockStore().getApi('model-test'))
                    .then((api) => expect(api).to.exist);
            });
    
            it('should fail if an api is not registered', () => {
                return core.getMockStore()
                    .getApi('model-test')
                    .catch((res) => expect(res).to.equal("Api not found"));
            });
        });

        
    });

});
