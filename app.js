const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./controllers'));

app.listen(config.get('express.port'), () => {
    console.log('Running on port ' + config.get('express.port'));
});
