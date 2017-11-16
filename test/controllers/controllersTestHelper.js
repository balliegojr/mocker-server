const controllers = require('../../src/controllers');
const core = require('../../src/core');
const MockedApi = require('../../src/core/mockedApi');
const chai = require('chai');
chai.use(require('chai-http'));
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sinon = require('sinon');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', controllers);


let mockedApi = new MockedApi();
const fakeMockStore = {
    getApi: () => { return Promise.resolve(mockedApi) }
}
const fakeModelStore = core.getModelStore();

const _request = chai.request(app);
const request = {
    get: (url, query) => {
        let _call = _request.get(url);
        if (query){
            _call = _call.query(query);
        }

        return new Promise((resolve, reject) => {
            _call.end((err, res) => {
                if (err) { 
                    reject(res);
                } else {
                    resolve(res);
                }
            });
        });
    },
    delete: (url, query) => {
        let _call = _request.delete(url);
        if (query){
            _call = _call.query(query);
        }

        return new Promise((resolve, reject) => {
            _call.end((err, res) => {
                if (err) { 
                    reject(res);
                } else {
                    resolve(res);
                }
            });
        });
    },
    post: (url, query, body) => {
        let _call = _request.post(url);
        if (query){
            _call = _call.query(query);
        }

        if (body) {
            _call = _call.send(body);
        }

        return new Promise((resolve, reject) => {
            _call.end((err, res) => {
                if (err) { 
                    reject(res);
                } else {
                    resolve(res);
                }
            });
        });
    },
    put: (url, query, body) => {
        let _call = _request.put(url);
        if (query){
            _call = _call.query(query);
        }

        if (body) {
            _call = _call.send(body);
        }

        return new Promise((resolve, reject) => {
            _call.end((err, res) => {
                if (err) { 
                    reject(res);
                } else {
                    resolve(res);
                }
            });
        });
    }
}

    



module.exports = {
    request: request,
    stubFilter: () => {
        sinon.stub(core.filter, 'build');
    },
    stubMockStore: () => {
        sinon.stub(core, 'getMockStore').returns(fakeMockStore);
    },
    stubModelStore: (setUp) => {
        if (setUp){
            sinon.stub(core, 'getModelStore').returns(fakeModelStore);
            
            sinon.stub(fakeModelStore, 'getAll');
            sinon.stub(fakeModelStore, 'get');
            sinon.stub(fakeModelStore, 'insert');
            sinon.stub(fakeModelStore, 'delete');
            sinon.stub(fakeModelStore, 'forceDelete');
        }

        return fakeModelStore;
    },
    stubMockedApi: (setUp) => {
        if (setUp){
            sinon.stub(mockedApi, 'getFiltered');
            sinon.stub(mockedApi, 'countFiltered');
            sinon.stub(mockedApi, 'delete');
            sinon.stub(mockedApi, 'get');
            sinon.stub(mockedApi, 'put');
            sinon.stub(mockedApi, 'post');
        }

        return mockedApi;
    },
    restoreFilter: () => {
        core.filter.build.restore();
    },
    restoreMockStore: () => {
        core.getMockStore.restore();
    },
    restoreModelStore: () => {
        core.getModelStore.restore();
    },
    restoreMockedApi: () => {
        for (var method in mockedApi){
            
            if (mockedApi[method] && mockedApi[method]['restore']){
                mockedApi[method].restore();
            }
        }
    }
};