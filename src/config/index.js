const global_registry = require('../util/registry');
const config = global_registry.isolated(undefined, true);

config.set('express.port', 3000);
config.set('mocker.singleUser', true);
config.set('mocker.strictUrl', false);
config.set('mocker.strictSchema', false);

config.set('db.type', 'nedb');
config.set('db.url', 'mocker.db')

module.exports = config;