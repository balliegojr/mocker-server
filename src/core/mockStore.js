const ModelStore = require('./modelStore');
const MockedApi = require('./mockedApi');


class MockStore {
    constructor(options = {}) {
        const _def = (val, def) => { return val === undefined ? def : val; };

        this.strictUrl = _def(options.strictUrl, false);
        this.ttl = _def(options.ttl, -1);
    }

    getApi(apiName) {
        return new Promise((resolve, reject) => {
            if (this.strictUrl === false){
                return resolve(new MockedApi(apiName));
            }

            var registeredAPis = new ModelStore();
            registeredAPis
                .get(apiName)
                .then(() => resolve(new MockedApi(apiName)))
                .catch(() => reject('Api not found'));
        });
    }
}

module.exports = MockStore;
