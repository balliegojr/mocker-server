const config = require('../config')
const filterBuilder = require('./filterBuilder');
const mockStore = require('./mockStore');
const modelStore = require('./modelStore');

module.exports = {
	getMockStore: () => {
		return new mockStore({
			strictUrl: config.get('mocker.strictUrl')
		});
	},
	getModelStore: () => {
		return new modelStore(config.get('mocker.ttl'));
	},
	filter: new filterBuilder(),
	ensureIndexes: () => {
		return (new modelStore(config.get('mocker.ttl'))).ensureIndexes();
	}
}