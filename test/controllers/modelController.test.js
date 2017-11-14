const config = require('../testconfig');
const chai = require('chai');
const expect = chai.expect;
const helper = require('./controllersTestHelper');
const request = helper.request;

const sinon = require('sinon');



describe('modelController', () => {
    before(() => {
        helper.stubModelStore(true);
    });

    after(() => {
        helper.restoreModelStore();
    });

    describe('GET api/model/', () => {
        it('should return an array of the specified mock', (done) => {
            const result = [ 1 ];
            helper.stubModelStore().getAll.returns( Promise.resolve(result) );
            
            request.get('/api/model')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).length(1);
                    expect(res.body[0]).to.equal(1);

                    expect(helper.stubModelStore().getAll.called).to.true;
                    done();
                });
        });

        it('should fail with 500 if an error ocurred', (done) => {
            helper.stubModelStore().getAll.returns( Promise.reject('An error ocurred'));
            
            request.get('/api/model/')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');

                    done();
                });
        });
    });

    describe('POST api/model/', () => {
        it('should insert a new model', (done) => {
            helper.stubModelStore().insert.returns( Promise.resolve({ id: 1, name: 'model'}));

            request.post('/api/model')
                .send({ name: 'model' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(1);
                    expect(res.body.name).to.equal('model');

                    expect(helper.stubModelStore().insert.calledWith('model')).to.true;
                    done();
                });
        });

        it('should fail with 400 invalid request, when name is not sent', (done) => {
            helper.stubModelStore().insert.reset();
            
            request.post('/api/model')
                .send({ field: 'unrelated' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.text).to.equal('It is necessary to send a message in the format { name: \'model name\'}');

                    expect(helper.stubModelStore().insert.called).to.false;
                    done();
                });
        });

        it('should fail with 500', (done) => {
            helper.stubModelStore().insert.returns( Promise.reject("An error ocurred") );

            request.post('/api/model')
                .send({ name: 'error' })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');

                    done();
                });
        });
    });

    describe('DELETE api/model/:id', () => {
        it('should delete an existent model', (done) => {
            helper.stubModelStore().delete.returns( Promise.resolve(1) );
            
            request.delete('/api/model/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('1');

                    expect(helper.stubModelStore().delete.calledWith('1')).to.true;
                    done();
                });
        });

        it('should fail with 404 when the model is not found', (done) => {
            helper.stubModelStore().delete.returns( Promise.reject('Not found') );
            
            request.delete('/api/model/1')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');
                    
                    done();
                });
        });

        it('should fail with 500 for any other errors', (done) => {
            helper.stubModelStore().delete.returns( Promise.reject('There are registers to this model, delete them manually or use forceDelete') );
            
            request.delete('/api/model/1')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('There are registers to this model, delete them manually or use forceDelete');
                    
                    done();
                });
        });
    });

    describe('DELETE api/model/:id/force', () => {
        it('should delete an existent model', (done) => {
            helper.stubModelStore().forceDelete.returns( Promise.resolve(1) );
            
            request.delete('/api/model/1/force')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('1');

                    expect(helper.stubModelStore().delete.calledWith('1')).to.true;
                    done();
                });
        });

        it('should fail with 404 when the model is not found', (done) => {
            helper.stubModelStore().forceDelete.returns( Promise.reject('Not found') );
            
            request.delete('/api/model/1/force')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');
                    
                    done();
                });
        });

        it('should fail with 500 for any other errors', (done) => {
            helper.stubModelStore().forceDelete.returns( Promise.reject('An error ocurred') );
            
            request.delete('/api/model/1/force')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');
                    
                    done();
                });
        });
    });

    

});
