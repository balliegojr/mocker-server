// require('../testconfig');
const core = require('../../src/core');
const expect = require('chai').expect;

describe('filterBuilder', () =>{
    let _builder;
    before(() => {
        _builder = core.filter;
    });

    it('Should have a build method', () => expect(_builder.build).to.be.a('function'));

    it('Should build the sorting filter', () => {
        let filter = _builder.build({ sort: 'field,field2,-field3'});
        expect(filter.sorting.field).to.equal(1);
        expect(filter.sorting.field2).to.equal(1);
        expect(filter.sorting.field3).to.equal(-1);

        expect(_builder.build({sort: ''}).sorting).to.not.exist;
    });

    it('Should build the pagination filter', ()=> {
        let filter = _builder.build({ skip: 10, limit: 20 });
        expect(filter.pagination.skip).to.equal(10);
        expect(filter.pagination.limit).to.equal(20);
    });

    it('Should build the filtering filter', ()=> {
        let filter = _builder.build({ filtering: '{ "field": "value" }' });
        expect(filter.filtering.field).to.equal('value');
    });

});