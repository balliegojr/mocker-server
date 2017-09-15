const config = require('../config')
const filterBuilder = require('./filterBuilder');
const mocker = require('./mocker');

var _mocker = new mocker({
		singleUser: config.get('mocker.singleUser'),
		strictUrl: config.get('mocker.strictUrl'),
		strictSchema: config.get('mocker.strictSchema'),
		ttl: config.get('mocker.ttl'),
		cached: config.get('mocker.cached')
	});

module.exports = {
	getMocker: () => {
		return _mocker;
	},
	filter: new filterBuilder(),
}