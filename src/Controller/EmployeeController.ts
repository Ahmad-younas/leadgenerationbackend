import { Request, Response } from "express";
import { Job } from "../Model/model";
import logger from "../logger";

export const getLeads = (req: Request, res: Response) => {
  res.send("Leads Add Successfully").status(201);
};
export const updateLeads = (req: Request, res: Response) => {
  res.send("Update Add Successfully").status(201);
};
export const addLeads = async (req: Request, res: Response) => {
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
    const newJob = await Job.create({
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
    logger.info("Job created");
    res.status(201).json({ message: "Job added successfully", Job: newJob });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error adding job", error: err });
  }
};
