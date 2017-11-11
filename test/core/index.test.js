const config = require('../testconfig');
const core = require('../../src/core');
const expect = require('chai').expect;


describe('core', () =>{
    it('should expose core methods', () => {
        expect(core.ensureIndexes).to.be.a('function');
        expect(core.filter).to.be.a('object');
        expect(core.getMockStore).to.be.a('function');
        expect(core.getModelStore).to.be.a('function');

        expect(Object.getOwnPropertyNames(core)).to.length(4);
    });
});