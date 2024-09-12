import { Request, Response } from "express";
import { Employee, Job, Month } from "../Model/model";
import logger from "../logger";
import { Sequelize } from "sequelize-typescript";
import { Op, WhereOptions } from "sequelize";

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
  console.log("requestBody", req.body);
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
      status: "Booked",
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
export const getJobInfoOfEmployee = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const { id } = req.params;
  console.log("id", id);
  try {
    // Fetch users with associated employee jobs
    const usersWithJobs = await Job.findAll({
      attributes: [
        "id",
        "user_id",
        "title",
        "firstName",
        "lastName",
        "dateOfBirth",
        "email",
        "contactNumber",
        "address",
        "postcode",
        "landlordName",
        "landlordContactNumber",
        "landlordEmail",
        "heatingType",
        "propertyType",
        "epcRating",
        "serviceType",
        "assessmentDate",
        "notes",
      ],
      where: {
        user_id: id, // Replace '1' with the actual user ID you are filtering by
      },
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job.count({
      where: {
        user_id: id, // Ensure 'id' is defined and represents the actual user ID
      },
    });
    const totalPages = Math.ceil(totalEmployees / limit);
    res.status(200).json({
      usersWithJobs,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};

export const getJobInfoOfEmployeeWithPagination = async (
  req: Request,
  res: Response,
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const id = parseInt(req.query.id as string);
  console.log("id", id);
  try {
    // Fetch users with associated employee jobs
    const usersWithJobs = await Job.findAll({
      attributes: [
        "title",
        "firstName",
        "lastName",
        "dateOfBirth",
        "email",
        "contactNumber",
        "address",
        "postcode",
        "landlordName",
        "landlordContactNumber",
        "landlordEmail",
        "heatingType",
        "propertyType",
        "epcRating",
        "serviceType",
        "assessmentDate",
        "notes",
      ],
      where: {
        user_id: id, // Replace '1' with the actual user ID you are filtering by
      },
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job.count({
      where: {
        user_id: id, // Ensure 'id' is defined and represents the actual user ID
      },
    });
    const totalPages = Math.ceil(totalEmployees / limit);
    res.status(200).json({
      usersWithJobs,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};

export const getIndividualEmployeeWithJobInfo = async (
  req: Request,
  res: Response,
) => {
  const { employeeJobId, employeeId } = req.body;
  console.log("employeeJobId", employeeJobId);
  console.log("employeeId", employeeId);
  try {
    // Fetch users with associated employee jobs
    const employeeInfo = await Employee.findByPk(employeeId);
    console.log("employeeInfo", employeeInfo);

    // Fetch the employee job information using employeeJobId
    const employeeJobInfo = await Job.findByPk(employeeJobId);
    console.log("employeeJobInfo", employeeJobInfo);

    // Check if both employeeInfo and employeeJobInfo exist
    if (!employeeInfo || !employeeJobInfo) {
      return res.status(404).json({
        message: "Employee or Employee Job not found",
      });
    }
    res.status(200).json({
      employeeInfo,
      employeeJobInfo,
    });
  } catch (error) {
    console.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};
export const getMonthlyJobCountOfEmployee = async (
  req: Request,
  res: Response,
) => {
  // Extract the userId and year from the request query parameters
  const id = parseInt(req.query.id as string);
  console.log("id", id);

  try {
    // Ensure userId and year are provided and valid
    if (!id) {
      return res.status(400).json({
        message: "Missing 'userId' or 'year' query parameter",
      });
    }

    // Perform the Sequelize query to get the monthly job count
    const monthlyJobCounts = await Month.findAll({
      attributes: [
        "month_name",
        [
          Sequelize.fn("COUNT", Sequelize.col("jobs.id")),
          "total_jobs_on_each_month",
        ], // Count the total jobs for each month
      ],
      include: [
        {
          model: Job,
          as: "jobs", // Use the alias defined in the association
          attributes: [], // Exclude all attributes from Job, only need the count
          where: {
            year: new Date().getFullYear(), // Filter by year
            user_id: id, // Filter by the provided user ID
          },
          required: false, // Ensures a LEFT JOIN
        },
      ],
      group: ["Month.month_name"], // Group by the month_name column
      raw: true, // Use raw SQL for more control
    });
    console.log(monthlyJobCounts);

    // Send the result as a response
    res.status(200).json(monthlyJobCounts);
  } catch (error) {
    console.error("Error fetching monthly job count:", error);
    res.status(500).json({
      message: "Failed to fetch monthly job count",
      error: error,
    });
  }
};

export const getStatusCountOfJobs = async (req: Request, res: Response) => {
  const id = parseInt(req.query.user_id as string);

  try {
    // Ensure userId and year are provided and valid
    if (!id) {
      return res.status(400).json({
        message: "Missing 'userId' or 'year' query parameter",
      });
    }

    // Perform the Sequelize query to get the monthly job count
    const monthlyJobCounts = await Job.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("status")), "status_count"],
      ],
      where: {
        status: {
          [Op.ne]: null, // Exclude null statuses
        },
        user_id: id, // Filter by user_id = '3'
      } as WhereOptions,
      group: ["status"], // Group by the 'status' column
    });

    // Send the result as a response
    res.status(200).json(monthlyJobCounts);
  } catch (error) {
    console.error("Error fetching monthly job count:", error);
    res.status(500).json({
      message: "Failed to fetch monthly job count",
      error: error,
    });
  }
};
