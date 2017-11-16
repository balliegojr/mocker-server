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
        it('should return an array of the specified mock', () => {
            const result = [ 1 ];
            helper.stubModelStore().getAll.returns( Promise.resolve(result) );
            
            return request.get('/api/model')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).length(1);
                    expect(res.body[0]).to.equal(1);

                    expect(helper.stubModelStore().getAll.called).to.true;
                });
        });

        it('should fail with 500 if an error ocurred', () => {
            helper.stubModelStore().getAll.returns( Promise.reject('An error ocurred'));
            
            return request.get('/api/model/')
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');
                });
        });
    });

    describe('POST api/model/', () => {
        it('should insert a new model', () => {
            helper.stubModelStore().insert.returns( Promise.resolve({ id: 1, name: 'model'}));

            return request.post('/api/model', null, { name: 'model' })
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(1);
                    expect(res.body.name).to.equal('model');

                    expect(helper.stubModelStore().insert.calledWith('model')).to.true;
                });
        });

        it('should fail with 400 invalid request, when name is not sent', () => {
            helper.stubModelStore().insert.reset();
            
            return request.post('/api/model', null, { field: 'unrelated' })
                .catch((res) => {
                    expect(res).to.have.status(400);
                    expect(res.text).to.equal('It is necessary to send a message in the format { name: \'model name\'}');

                    expect(helper.stubModelStore().insert.called).to.false;
                });
        });

        it('should fail with 500', () => {
            helper.stubModelStore().insert.returns( Promise.reject("An error ocurred") );

            return request.post('/api/model', null, { name: 'error' })
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');
                });
        });
    });

    describe('DELETE api/model/:id', () => {
        it('should delete an existent model', () => {
            helper.stubModelStore().delete.returns( Promise.resolve(1) );
            
            return request.delete('/api/model/1')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('1');

                    expect(helper.stubModelStore().delete.calledWith('1')).to.true;
                });
        });

        it('should fail with 404 when the model is not found', () => {
            helper.stubModelStore().delete.returns( Promise.reject('Not found') );
            
            return request.delete('/api/model/1')
                .catch((res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal('Resource not found');
                });
        });

        it('should fail with 500 for any other errors', () => {
            helper.stubModelStore().delete.returns( Promise.reject('An error ocurred') );
            
            return request.delete('/api/model/1')
                .catch((res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.equal('An error ocurred');
                });
        });
    });
});
