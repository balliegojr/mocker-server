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
			.then((api) => api.getFiltered(core.filter.build(req.params.queryString)))
			.then((response) => res.send(response))
			.catch((response) => res.status(500).send(response));
	})
	.post((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.post(req.body)
			.then((response) => res.send(response))
			.catch((response) => res.status(500).send(response));
	});

router
	.route('/:mockName/:id')
	.get((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.then((api) => api.get(req.params.id))
			.then((response) => res.send(response))
			.catch((response) => res.status(500).send(response));
	})
	.put((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.put(req.params.id, req.body)
			.then((response) => res.send(response))
			.catch((response) => res.status(500).send(response));
	})
	.delete((req, res) => {
		core
			.getMocker()
			.getApi(req.params.mockName)
			.delete(req.params.id)
			.then((response) => res.status(204).end())
			.catch((response) => res.status(500).send(response));
	});


module.exports = router;