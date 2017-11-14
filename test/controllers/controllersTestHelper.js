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

module.exports = {
    request: chai.request(app),
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