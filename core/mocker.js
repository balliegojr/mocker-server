class MockedApi {
    constructor(props) {
        
    }

    get() {
        return new Promise((resolve, reject) => { resolve() });
    }

    getFiltered() {
        return new Promise((resolve, reject) => { resolve() });
    }

    post() {
        return new Promise((resolve, reject) => { resolve() });

    }

    put() {
        return new Promise((resolve, reject) => { resolve() });

    }

    delete() {
        return new Promise((resolve, reject) => { resolve() });

    }
}


class Mocker {
    constructor(options) {
        const default = (val, def) => { return val === undefined ? def : val; };

        this.singleUser = default(options.singleUser, true);
        this.strictUrl = default(options.strictUrl, false);
        this.strictSchema = default(options.strictSchema, false);
        this.cached = default(options.cache, false);
        this.ttl = default(options.ttl, -1);
    }

    getApis() {

    }

    saveApi(api) {

    }

    removeApi(api) {

    }

    getApi(apiName) {
        return new MockedApi();
    }
}

module.exports = Mocker;