const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const allEmployees = await Employee.find();
    res.json(allEmployees);
}

const getEmployee = async (req, res) => {
    const employee = await Employee.findOne({_id: req.params.id}).exec();
    if(!employee){
        return res.status(204).json({ 'message': 'Employee not found.' })
    }
    res.json(employee);
}

const createNewEmployee = async (req, res) => {
    const {firstname, lastname} = req.body;

    if(!firstname || !lastname)
        return res.status(400).json({ 'message' : 'First and last name required.'});
    
    try {
        const newEmployee = await Employee.create({ firstname, lastname });
        res.status(201).json(newEmployee);   
    } catch (error) {
        console.log(err);
    }
}

const updateEmployee = async (req, res) => {
    const {firstname, lastname} = req.body;
    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${id} not found` });
    }
    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname = lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if(!req.params.id) return res.status(400).json({ 'message': 'Employee ID required.' });
    
    const employee = await Employee.findOne({ _id: req.params.id}).exec();

    if(!employee) res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    const result = await employee.deleteOne();
    res.json(result);
}

module.exports = { getAllEmployees, getEmployee, createNewEmployee, updateEmployee, deleteEmployee }