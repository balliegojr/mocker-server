const config = require('./config');
const program = require('commander');

program
.version('0.1.0')
.option('-c, --config [file]', 'Path to the config file')
.option('--init [file]', 'Create a config file with the default configurations')
.option('-p, --port [port]', 'Express port number')
.option('--strict-url', 'Validate model url')
.option('--db-path', 'Path to db file')
.parse(process.argv);

const param_options = {
    'express.port': 'port',
    'mocker.strictUrl': 'strict-url',
    'db.url': 'db-path'
}

if (program.config){
    config.load(program.config);
} else {
    config.loadDefault();
}

config.setOptions(program);

if (program.init){
    config.save(program.init);
    process.exit(1);
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./controllers'));

app.listen(config.get('express.port'), () => {
    console.log('Running on port ' + config.get('express.port'));
});
