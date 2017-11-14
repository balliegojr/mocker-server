const config = require('./config');
const program = require('commander');

program
.version('0.1.0')
.option('-c, --config [file]', 'Path to the config file')
.option('--save [file]', 'Create a config file with the default configurations')
.option('-p, --port [port]', 'Express port number')
.option('--strict-url', 'Validate model url')
.option('--db-path', 'Path to db file')
.option('--in-memory', 'Run using a memory database')
.parse(process.argv);

if (program.config){
    config.load(program.config);
} else {
    config.loadDefault();
}

config.setOptions(program);

if (program.save){
    config.save(program.save);
    process.exit(1);
    return;
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const core = require('./core');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./controllers'));

core.ensureIndexes().then(() => {
    app.listen(config.get('express.port'), () => {
        console.log('Running on port ' + config.get('express.port'));
    });
});