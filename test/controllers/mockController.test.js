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
        it('should return an array of the specified mock', (done) => {
            const result = [ 1 ];
            stubedApi.getFiltered.returns( Promise.resolve(result) );
            
            request.get('/api/mock/modelx')
                .query('filter=x')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).length(1);
                    expect(res.body[0]).to.equal(1);

                    expect(core.filter.build.calledWith({ filter: 'x'})).to.true;
                    expect(stubedApi.getFiltered.calledWith('fake-filter')).to.true;
                    done();
                });
        });

        it('should fail with 500 if an error ocurred', (done) => {
            stubedApi.getFiltered.returns( Promise.reject('An error ocurred'));
            
            request.get('/api/mock/modelx')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');

                    done();
                });
        });
    });

    describe('GET api/mock/:mock/count', () => {
        it('should return the count of items', (done) => {
            stubedApi.countFiltered.returns( Promise.resolve(10) );
            
            request.get('/api/mock/modelx/count')
                .query('filter=x')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('10');

                    expect(core.filter.build.calledWith({ filter: 'x'})).to.true;
                    expect(stubedApi.countFiltered.calledWith('fake-filter')).to.true;
                    done();
                });
        });

        it('should fail with 500 if an error ocurred', (done) => {
            stubedApi.countFiltered.returns( Promise.reject('An error ocurred'));
            
            request.get('/api/mock/modelx')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');

                    done();
                });
        });
    });

    describe('GET api/mock/:mock/:id', () => {
        it('should return the specified mock item', (done) => {
            
            stubedApi.get.returns( Promise.resolve( { id: 1 }) );
            
            request.get('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(1);

                    expect(stubedApi.get.calledWith('1')).to.true;
                    done();
                });
        });

        it('should fail with 404 when the resource is not found', (done) => {
            stubedApi.get.returns( Promise.reject('Not found'));
            
            request.get('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');

                    done();
                });
        });

        it('should fail with 500 for another errors', (done) => {
            stubedApi.get.returns( Promise.reject('Error message'));
            
            request.get('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');

                    done();
                });
        });
    });

    describe('POST api/mock/:mock', () => {
        it('should insert a new item', (done) => {
            
            stubedApi.post.returns( Promise.resolve( { id: 1, field:'x' }) );
            
            request.post('/api/mock/modelx/')
                .send({ field: 'x' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(1);
                    expect(res.body.field).to.equal('x');

                    expect(stubedApi.post.calledWith({ field: 'x' })).to.true;
                    done();
                });
        });

        it('should fail with 500 for another errors', (done) => {
            stubedApi.post.returns( Promise.reject('Error message'));
            
            request.post('/api/mock/modelx')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');

                    done();
                });
        });
    });

    describe('PUT api/mock/:mock/:id', () => {
        it('should update an existent item', (done) => {
            
            stubedApi.put.returns( Promise.resolve( { id: 1, field:'x' }) );
            
            request.put('/api/mock/modelx/1')
                .send({ field: 'x' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.id).to.equal(1);
                    expect(res.body.field).to.equal('x');

                    expect(stubedApi.put.calledWith('1', { field: 'x' })).to.true;
                    done();
                });
        });

        it('should fail with 404 for Not Found', (done) => {
            stubedApi.put.returns( Promise.reject('Not found'));
            
            request.put('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');

                    done();
                });
        });

        it('should fail with 500 for another errors', (done) => {
            stubedApi.put.returns( Promise.reject('Error message'));
            
            request.put('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');

                    done();
                });
        });
    });
    

    describe('DELETE api/mock/:mock/:id', () => {
        it('should delete an existent item', (done) => {
            
            stubedApi.delete.returns( Promise.resolve( 1 ) );
            
            request.delete('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(204);
                    expect(stubedApi.delete.calledWith('1')).to.true;
                    done();
                });
        });

        it('should fail with 404 for Not Found', (done) => {
            stubedApi.delete.returns( Promise.reject('Not found'));
            
            request.delete('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');

                    done();
                });
        });

        it('should fail with 500 for another errors', (done) => {
            stubedApi.delete.returns( Promise.reject('Error message'));
            
            request.delete('/api/mock/modelx/1')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('Error message');

                    done();
                });
        });
    });

});
