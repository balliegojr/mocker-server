const config = require('../testconfig');
const chai = require('chai');
const expect = chai.expect;
const helper = require('./controllersTestHelper');
const request = helper.request;

const sinon = require('sinon');
const core = require('../../src/core');


describe('mockController', () => {
    let stubedApi;

    before(() => {
        helper.stubMockStore();
        helper.stubFilter();
        core.filter.build.returns('fake-filter');
        stubedApi = helper.stubMockedApi(true);
    });

    beforeEach(() => {
        //stubedApi.getFiltered.reset();
    })

    after(() => {
        helper.restoreMockStore();
        helper.restoreMockedApi();
        helper.restoreFilter();
    });

    describe('GET api/mock/:mock/', () => {
        it('should return an array of the specified mock', () => {
            const result = [ 1 ];
            stubedApi.getFiltered.returns( Promise.resolve(result) );
            
            return request.get('/api/mock/modelx', 'filter=x')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).length(1);
                    expect(res.body[0]).to.equal(1);

                    expect(core.filter.build.calledWith({ filter: 'x'})).to.true;
                    expect(stubedApi.getFiltered.calledWith('fake-filter')).to.true;
                });
        });

        it('should fail with 500 if an error ocurred', () => {
            stubedApi.getFiltered.returns( Promise.reject('An error ocurred'));
            
            return request.get('/api/mock/modelx')
                .catch((err) => {
                    expect(err).to.have.status(500);
                    expect(err.text).to.equal('An error ocurred');
                });
        });
    });

    describe('GET api/mock/:mock/count', () => {
        it('should return the count of items', () => {
            stubedApi.countFiltered.returns( Promise.resolve(10) );
            
            return request.get('/api/mock/modelx/count', 'filter=x')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('10');

                    expect(core.filter.build.calledWith({ filter: 'x'})).to.true;
                    expect(stubedApi.countFiltered.calledWith('fake-filter')).to.true;
                });
        });

        it('should fail with 500 if an error ocurred', () => {
            stubedApi.countFiltered.returns( Promise.reject('An error ocurred'));
            
            return request.get('/api/mock/modelx')
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');
                });
        });
    });

    describe('GET api/mock/:mock/:id', () => {
        it('should return the specified mock item', () => {
            
            stubedApi.get.returns( Promise.resolve( { id: 1 }) );
            
            return request.get('/api/mock/modelx/1')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(1);

                    expect(stubedApi.get.calledWith('1')).to.true;
                });
        });

        it('should fail with 404 when the resource is not found', () => {
            stubedApi.get.returns( Promise.reject('Not found'));
            
            return request.get('/api/mock/modelx/1')
                .catch((res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');
                });
        });

        it('should fail with 500 for another errors', () => {
            stubedApi.get.returns( Promise.reject('Error message'));
            
            return request.get('/api/mock/modelx/1')
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');
                });
        });
    });

    describe('POST api/mock/:mock', () => {
        it('should insert a new item', () => {
            stubedApi.post.returns( Promise.resolve( { id: 1, field:'x' }) );
            
            return request.post('/api/mock/modelx/', null, {field: 'x'})
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(1);
                    expect(res.body.field).to.equal('x');

                    expect(stubedApi.post.calledWith({ field: 'x' })).to.true;
                });
        });

        it('should fail with 500 for another errors', () => {
            stubedApi.post.returns( Promise.reject('Error message'));
            
            return request.post('/api/mock/modelx')
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');
                });
        });
    });

    describe('PUT api/mock/:mock/:id', () => {
        it('should update an existent item', () => {
            
            stubedApi.put.returns( Promise.resolve( { id: 1, field:'x' }) );
            
            return request.put('/api/mock/modelx/1', null, {field: 'x'})
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(1);
                    expect(res.body.field).to.equal('x');

                    expect(stubedApi.put.calledWith('1', { field: 'x' })).to.true;
                });
        });

        it('should fail with 404 for Not Found', () => {
            stubedApi.put.returns( Promise.reject('Not found'));
            
            return request.put('/api/mock/modelx/1')
                .catch((res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');
                });
        });

        it('should fail with 500 for another errors', () => {
            stubedApi.put.returns( Promise.reject('Error message'));
            
            return request.put('/api/mock/modelx/1')
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');
                });
        });
    });
    

    describe('DELETE api/mock/:mock/:id', () => {
        it('should delete an existent item', () => {
            
            stubedApi.delete.returns( Promise.resolve( 1 ) );
            
            return request.delete('/api/mock/modelx/1')
                .then((res) => {
                    expect(res).to.have.status(204);
                    expect(stubedApi.delete.calledWith('1')).to.true;
                });
        });

        it('should fail with 404 for Not Found', () => {
            stubedApi.delete.returns( Promise.reject('Not found'));
            
            return request.delete('/api/mock/modelx/1')
                .catch((res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');
                });
        });

        it('should fail with 500 for another errors', () => {
            stubedApi.delete.returns( Promise.reject('Error message'));
            
            return request.delete('/api/mock/modelx/1')
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');
                });
        });
    });

});
