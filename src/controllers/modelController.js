const express = require('express');
const router = express.Router();
const config = require('../config');

const core = require('../core');


router
    .route('/')
    .get((req, res) => {
        core
            .getModelStore()
            .getAll()
            .then((response) => res.send(response))
            .catch((response) => res.status(500).send(response))
            
    })
    .post((req, res) => {
        if (!req.body.name){
            res.status(400).send('It is necessary to send a message in the format { name: \'model name\'}');
            return;
        }

        core
            .getModelStore()
            .insert({ name: req.body.name, ttl: req.body.ttl })
            .then((response) => res.send(response))
            .catch((response) => res.status(500).send(response))
    });


router
    .route('/:id')
    .delete((req, res) => {
        core
        .getModelStore()
        .delete(req.params.id)
        .then((response) => res.send(response.toString()))
        .catch((response) => { 
            if (response === 'Not found'){
                res.status(404).send('Resource not found');
            } else {
                res.status(500).send(response);
            }
        });
    });


module.exports = router;