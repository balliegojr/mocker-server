const config = require('../config')
const filterBuilder = require('./filterBuilder');
const mockStore = require('./mockStore');
const modelStore = require('./modelStore');

module.exports = {
	getMockStore: () => {
		return new mockStore({
			singleUser: config.get('mocker.singleUser'),
			strictUrl: config.get('mocker.strictUrl'),
			strictSchema: config.get('mocker.strictSchema'),
			ttl: config.get('mocker.ttl'),
			cached: config.get('mocker.cached')
		});
	},
	getModelStore: () => {
		return new modelStore();
	},
	filter: new filterBuilder(),
}