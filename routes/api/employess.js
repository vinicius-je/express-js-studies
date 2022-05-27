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
        const {firstname, lastname} = req.body;
        const id = data.employees.length + 1
        data.employees.push({id ,firstname, lastname});
        res.send('ok');
    })
    .put((req, res) => {
        const {id, firstname, lastname} = req.body;
        data.employees.map((item) => {
            if(item.id == id){
                item.firstname = firstname;
                item.lastname = lastname;
        }});
        res.send('ok');
    });

router.route('/:id')
    .get((req, res) => {
        const item = data.employees.filter((item) => item.id == req.params.id);
        res.json(item);
    })
    .delete((req, res) => {
        const item = data.employees.filter((item) => item.id != req.params.id);
        data.employees = item;
        res.send(data.employees);
    });

module.exports = router;