"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeads = exports.updateLeads = exports.addLeads = void 0;
const addLeads = (req, res) => {
    res.send("Leads Add Successfully").status(201);
};
exports.addLeads = addLeads;
const updateLeads = (req, res) => {
    res.send("Update Add Successfully").status(201);
};
exports.updateLeads = updateLeads;
const getLeads = (req, res) => {
    res.send("Leads").status(200);
};
exports.getLeads = getLeads;
