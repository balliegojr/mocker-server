const config = require('../src/config');
config.loadDefault();
config.set('db.url', '');
config.set('db.options', { inMemoryOnly: true });
