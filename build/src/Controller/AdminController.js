"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmployee = exports.getLeads = void 0;
const getLeads = (req, res) => {
    res.send("Leads").status(200);
};
exports.getLeads = getLeads;
const addEmployee = (req, res) => {
    res.send("Employee add Successfully").status(201);
};
exports.addEmployee = addEmployee;
