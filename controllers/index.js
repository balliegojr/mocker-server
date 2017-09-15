const express = require('express');
const router = express.Router('/api');

router.get('/ping', (req, res) => { res.send('pong'); });
router.use('/api/mock', require('./mock'));

module.exports = router;