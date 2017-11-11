const express = require('express');
const router = express.Router();
const config = require('../config');

const core = require('../core');


router
	.route('/:mockName/')
	.get((req, res) => {
		core
			.getMockStore()
			.getApi(req.params.mockName)
			.then((api) => api.getFiltered(core.filter.build(req.query)))
			.then((response) => res.send(response))
			.catch((response) => res.status(500).send(response))
			
	})
	.post((req, res) => {
		core
			.getMockStore()
			.getApi(req.params.mockName)
			.then((api) => api.post(req.body))
			.then((response) => res.send(response))
			.catch((response) => res.status(500).send(response));
	});

router
	.get('/:mockName/count', (req, res) => {
		core
			.getMockStore()
			.getApi(req.params.mockName)
			.then((api) => api.countFiltered(core.filter.build(req.query)))
			.then((response) => res.send(response.toString()))
			.catch((response) => res.status(500).send(response));
	});

router
	.route('/:mockName/:id')
	.get((req, res) => {
		core
			.getMockStore()
			.getApi(req.params.mockName)
			.then((api) => api.get(req.params.id))
			.then((response) => res.send(response))
			.catch((response) => { 
				if (response === 'Not found'){
					res.status(404).send('Resource not found');
				} else {
					res.status(500).send(response);
				}
			});
			
	})
	.put((req, res) => {
		core
			.getMockStore()
			.getApi(req.params.mockName)
			.then((api) => api.put(req.params.id, req.body))
			.then((response) => res.send(response))
			.catch((response) => { 
				if (response === 'Not found'){
					res.status(404).send('Resource not found');
				} else {
					res.status(500).send(response);
				}
			});
	})
	.delete((req, res) => {
		core
			.getMockStore()
			.getApi(req.params.mockName)
			.then((api) => api.delete(req.params.id))
			.then((response) => res.status(204).end())
			.catch((response) => { 
				if (response === 'Not found'){
					res.status(404).send('Resource not found');
				} else {
					res.status(500).send(response);
				}
			});
	});


module.exports = router;