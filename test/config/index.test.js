const fs = require('fs');
const os = require('os');
const path = require('path');
require('../testconfig');
const config = require('../../src/config');
const expect = require('chai').expect;

const configFile = path.join(os.tmpdir(), 'tempconfig.rc');
const backupConfig = path.join(os.tmpdir(), 'backupconfig.rc');

describe('config', () => {
    before(() => {
        if (fs.existsSync(backupConfig)){
            fs.unlinkSync(backupConfig);
        }

        config.save(backupConfig);
    });
    
    after(() => {
        config.load(backupConfig);

        if (fs.existsSync(backupConfig)){
            fs.unlinkSync(backupConfig);
        }
    });

    
    beforeEach(() => {
        if (fs.existsSync(configFile)){
            fs.unlinkSync(configFile);
        }
    });

    afterEach(() => {
        if (fs.existsSync(configFile)){
            fs.unlinkSync(configFile);
        }
    });

    it('should save the config to a given file', () => {
        config.save(configFile);

        expect(fs.existsSync(configFile)).to.true;
        let configuration = JSON.parse(fs.readFileSync(configFile));

        expect(configuration['express.port']).to.equal(3000);
        expect(configuration['mocker.strictUrl']).to.equal(false);
        
        expect(configuration['db.type']).to.equal('nedb');
        expect(configuration['db.url']).to.equal('');
        expect(configuration['db.options'].inMemoryOnly).to.equal( true );
    });

    it('should read the config from a given file', () => {
        const configuration = {
            'db.options': { inMemoryOnly: false },
            'db.url': 'path'
        }

        fs.writeFileSync(configFile, JSON.stringify(configuration));
        config.load(configFile);

        expect(config.get('express.port')).to.equal(3000);
        expect(config.get('db.url')).to.equal('path');
        expect(config.get('db.options').inMemoryOnly).to.equal( false );
    });

    if('should set and get configurations', () => {
        config.set('express.port', 2000);
        expect(config.get('express.port')).to.equal(2000);
        
        config.set('express.port', 3000);
    });

    it('should set the options', () => {

        config.setOptions({
            inMemory: true,
            port: 200,
            'strict-url': true,
            'db-path': 'new-path'
        });

        expect(config.get('express.port')).to.equal(200);
        expect(config.get('db.url')).to.equal('new-path');
        expect(config.get('db.options').inMemoryOnly).to.equal( true );
    });

});