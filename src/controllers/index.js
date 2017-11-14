const express = require('express');
const router = express.Router('/api');

router.get('/ping', (req, res) => { res.send('pong'); });
router.use('/api/mock', require('./mockController'));
router.use('/api/model', require('./modelController'));

module.exports = router;