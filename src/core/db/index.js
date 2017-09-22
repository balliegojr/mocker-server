const config  = require('../../config');
const nedbStore = require('./nedb');

const dbType = config.get('db.type');

var dbStore;
if (dbType === 'nedb'){
    dbStore = new nedbStore(config.get('db.url'));
}

module.exports = {
    getStore: () => {
        return dbStore;
    }
}