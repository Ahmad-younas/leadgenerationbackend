"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLeads = exports.updateLeads = exports.getLeads = void 0;
const model_1 = require("../Model/model");
const logger_1 = __importDefault(require("../logger"));
const getLeads = (req, res) => {
  res.send("Leads Add Successfully").status(201);
};
exports.getLeads = getLeads;
const updateLeads = (req, res) => {
  res.send("Update Add Successfully").status(201);
};
exports.updateLeads = updateLeads;
const addLeads = async (req, res) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
  const {
    title,
    firstName,
    lastName,
    dateOfBirth,
    email,
    contactNumber,
    address,
    postcode,
    landlordName,
    landlordContactNumber,
    landlordEmail,
    agentName,
    agentContactNumber,
    agentEmail,
    heatingType,
    propertyType,
    epcRating,
    serviceType,
    assessmentDate,
    notes,
    //userId,
  } = req.body;
  try {
    const newJob = await model_1.Job.create({
      title,
      firstName,
      lastName,
      dateOfBirth,
      email,
      contactNumber,
      address,
      postcode,
      landlordName,
      landlordContactNumber,
      landlordEmail,
      agentName,
      agentContactNumber,
      agentEmail,
      heatingType,
      propertyType,
      epcRating,
      serviceType,
      assessmentDate,
      notes,
      user_id: 3,
      month: monthNames[monthIndex],
      year: new Date().getFullYear().toString(),
    });
    logger_1.default.info("Job created");
    res.status(201).json({ message: "Job added successfully", Job: newJob });
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error adding job", error: err });
  }
};
exports.addLeads = addLeads;
