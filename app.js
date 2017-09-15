const config = require('./config');
const express = require('express');
const app = express()


app.use('/', require('./controllers'));

app.listen(config.get('express.port'), () => {
    console.log('Running on port ' + config.get('express.port'));
});
