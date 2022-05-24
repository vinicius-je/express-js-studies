const express = require('express');
const router = express.Router();
const data = {};
data.employees = require('../../data/employees.json');

// different methods to the same route
router.route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        res.json({firstname, lastname} = req.body);
    })
    .put((req, res) => {
        res.json({firstname, lastname} = req.body);
    })
    .delete((req, res) => {
        res.json({"id": req.body.id})
    });

router.route('/:id')
    .get((req, res) => {
        res.json({"id": req.params.id});
    });

module.exports = router;