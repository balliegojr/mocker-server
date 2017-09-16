const express = require('express');
const router = express.Router();
const config = require('../config');

const core = require('../core');


router
	.route('/:mockName/')
	.get((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.then((api) => { return api.getFiltered(core.filter.build(req.params.queryString)); })
			.then((response) => res.send(response))
			.catch((response) => res.end(500));
	})
	.post((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.post(req.body)
			.then((response) => res.send(response))
			.catch((response) => res.end(500));
	});

router
	.route('/:mockName/:id')
	.get((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.then((api) => { return api.get(req.params.id); })
			.then((response) => { res.send(response); })
			.catch((response) => { console.log(response); res.status(500).send(response) });
	})
	.put((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.put(req.params.id, req.body)
			.then((response) => res.send(response))
			.catch((response) => res.end(500));
	})
	.delete((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.delete(req.params.id)
			.then((response) => res.end(204))
			.catch((response) => res.end(500));
	});


module.exports = router;