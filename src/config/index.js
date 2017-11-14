const global_registry = require('../util/registry');
const default_config = global_registry.isolated(undefined, false);
const fs = require('fs');

const __default_config_file = '.mockerserver.json';

default_config.set('express.port', 3000);
default_config.set('mocker.strictUrl', false);

default_config.set('db.type', 'nedb');
default_config.set('db.url', 'mocker.db')
default_config.set('db.options', { inMemoryOnly: false });

const param_options = {
    'express.port': 'port',
    'mocker.strictUrl': 'strict-url',
    'db.url': 'db-path'
}

class Configuration {
    get(key) {
        return default_config.get(key);
    }
    
    set(key, value) {
        default_config.set(key, value);
    }

    loadDefault() {
        if (fs.existsSync(__default_config_file)){
            this.load(__default_config_file);
        }
    }

    load(path) {
        if (!fs.existsSync(path)){
            throw Error("Config path not found");
        }

        const config = JSON.parse(fs.readFileSync(path));
        for (var key in config){
            if (config[key] !== undefined && config[key] !== null){
                default_config.set(key, config[key]);
            }
        }
    }

    save(path) {
        fs.writeFileSync(path, JSON.stringify(default_config.getValues()));
    }

    setOptions(options) {
        for(var key in param_options){
            var option = param_options[key];
            if (options[option]){
                default_config.set(key, options[option]);
            }
        }

        if (options.inMemory){
            default_config.set('db.options', { inMemoryOnly: true});
        }
    }
}


module.exports = new Configuration();