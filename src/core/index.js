const config = require('../config')
const filterBuilder = require('./filterBuilder');
const mockStore = require('./mockStore');
const modelStore = require('./modelStore');

module.exports = {
	getMockStore: () => {
		return new mockStore({
			strictUrl: config.get('mocker.strictUrl'),
			ttl: config.get('mocker.ttl'),
		});
	},
	getModelStore: () => {
		return new modelStore();
	},
	filter: new filterBuilder(),
	ensureIndexes: () => {
		(new modelStore()).ensureIndexes();
	}
}