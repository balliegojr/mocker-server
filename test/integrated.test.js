const config = require('./testconfig');
const chai = require('chai');
const expect = chai.expect;
const helper = require('./controllers/controllersTestHelper');
const request = helper.request;

const core = require('../src/core');

describe('integrated test', () => {
    before(() => {
        config.set('strict-url', true);
    });

    after(() => {
        config.set('strict-url', false);
    });

    it('should insert, retrive and change models', () => {
        let anderson = null;

        return request.post('/api/model', null, { name: 'person' })
            then(() => request.post('/api/mock/person', null, { name: 'anderson', age: 29}))
            .then((res) => {
                anderson = res.body;
                return request.get('/api/mock/person/' + anderson.id);
            })
            .then((res) => {
                expect(res.body.id).to.equal(anderson.id);
                expect(res.body.name).to.equal(anderson.name);

                return request.post('/api/mock/person', null, { name: 'maria', age: 30 });
            })
            .then(() => request.post('/api/mock/person', null, { name: 'joana', age: 22 }))
            .then(() => request.get('/api/mock/person', null))
            .then((res) => {
                expect(res.body).to.have.length(3);

                return request.get('/api/mock/person', { skip: 1, limit: 2, sort: '-age' });
            })
            .then((res) => {
                expect(res.body).to.have.length(2);
                expect(res.body[0].age).to.equal(29);
                expect(res.body[1].age).to.equal(22);
                
                return request.get('/api/mock/person', { filtering: JSON.stringify({ name: 'anderson' }) });
            })
            .then((res) => {
                expect(res.body).to.have.length(1);
                expect(res.body[0].age).to.equal(29);

                return request.put('/api/mock/person/' + anderson.id, null, { name: 'anderson', age: 40 });
            })
            .then((res) => request.get('/api/mock/person/' + anderson.id))
            .then((res) => {
                expect(res.body.age).to.equal(40);
                return request.delete('/api/mock/person/' + anderson.id);
            })
            .then((res) => request.get('/api/mock/person'))
            .then((res) => { 
                expect(res.body).to.have.length(2);
                return request.get('/api/mock/person', { filtering: JSON.stringify({ name: anderson})});
            })
            .then((res) => {
                expect(res.body).to.have.length(0);
            });
    });
});
