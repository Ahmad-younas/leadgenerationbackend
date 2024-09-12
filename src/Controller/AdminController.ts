import { Request, Response } from "express";
import Employee from "../Model/Employee";
import logger from "../logger";
import Job from "../Model/Job";
import { decryptPassword, encryptedPassword } from "../Middleware/auth";
import { Month } from "../Model/Month";
import { Sequelize } from "sequelize-typescript";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const jobs = await Job.findAll({
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job.count(); // Get the total number of employees
    const totalPages = Math.ceil(totalEmployees / limit);
    //const totalJobs = await Job.count();
    res.status(200).json({
      jobs,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error finding jobs", err });
  }
};
export const addEmployee = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = encryptedPassword(password);
    console.log(hashedPassword);
    const newEmployee = await Employee.create({
      username: name,
      email: email,
      password: hashedPassword,
      role: role,
    });
    logger.info("Employee created");
    res
      .status(201)
      .json({ message: "Employee added successfully", Employee: newEmployee });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error adding user", error: err });
  }
};
export const updateEmployee = async (req: Request, res: Response) => {
  const { id, name, email, password, role } = req.body;
  try {
    const hashedPassword = encryptedPassword(password);
    const updateEmployee = await Employee.update(
      {
        username: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
      {
        where: {
          id,
        },
      },
    );
    logger.info("Employee updated");
    res
      .status(200)
      .json({ message: "Employee updated successfully", updateEmployee });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error updating employee", err });
  }
};

export const findAllEmployee = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const employees = await Employee.findAll({
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Employee.count(); // Get the total number of employees
    const totalPages = Math.ceil(totalEmployees / limit);
    const employeeData = employees.map((row) => {
      const password = row.dataValues.password
        ? decryptPassword(row.dataValues.password)
        : undefined;
      return {
        username: row.dataValues.username,
        email: row.dataValues.email,
        password: password,
        role: row.dataValues.role,
        id: row.dataValues.id,
      };
    });
    res.status(200).json({
      data: employeeData,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error finding employee", err });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const deleted = await Employee.destroy({
      where: { id },
    });

    if (deleted) {
      logger.info(`Employee with id ${id} deleted successfully`);
      return res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      logger.error(`Employee with id ${id} not found`);
      return res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return res
        .status(500)
        .json({ message: "Error deleting employee", error: err.message });
    }
    return res
      .status(500)
      .json({ message: "Unknown error occurred while deleting employee" });
  }
};
export const getMonthlyJobCounts = async (req: Request, res: Response) => {
  try {
    const results = await Month.findAll({
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("jobs.id")),
          "total_jobs_on_each_month",
        ],
      ],
      include: [
        {
          model: Job,
          as: "jobs",
          attributes: [], // We don't need to select any specific job fields here
          required: false, // LEFT JOIN behavior
          where: {
            year: new Date().getFullYear(),
          },
        },
      ],
      group: ["Month.month_name"],
      order: [["id", "ASC"]],
    });
    res.status(200).json(results);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res
      .status(500)
      .json({ message: "Error fetching job counts by month", err });
  }
};

export const getEmployeeInfoAndEmployeeJobInfo = async (
  req: Request,
  res: Response,
) => {
  const { employeeJobId, employeeId } = req.body;
  try {
    // Fetch the employee information using employeeId
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
  } catch (err) {
    // Handle any unexpected errors
    if (err instanceof Error) {
      console.error(err.message);
    }
    res
      .status(500)
      .json({ message: "Error retrieving employee information", err });
  }
};

export const getEmployeeWithJobInfo = async (req: Request, res: Response) => {
  try {
    const usersWithJobs = await Employee.findAll({
      attributes: ["username", "password", "role", "email"], // Specify the fields from the Users table
      include: [
        {
          model: Job,
          as: "jobs", // Include the EmployeeJobs model
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
            "user_id",
            "month",
            "year",
          ],
          required: true, // Performs an INNER JOIN
        },
      ],
    });

    // Send the result as a response
    res.status(200).json(usersWithJobs);
  } catch (error) {
    console.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};
