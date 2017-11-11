const config  = require('../../config');
const nedbStore = require('./nedb');

const dbType = config.get('db.type');

// var dbStore;
// if (dbType === 'nedb'){
//     dbStore = new nedbStore(config.get('db.url'), config.get('db.options'));
// }

module.exports = {
    getStore: () => {
        if (dbType === 'nedb'){
            return new nedbStore(config.get('db.url'), config.get('db.options'));
        }
    }
}