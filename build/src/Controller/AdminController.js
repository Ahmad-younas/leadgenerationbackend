"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeInfoAndEmployeeJobInfo =
  exports.getMonthlyJobCounts =
  exports.deleteEmployee =
  exports.findAllEmployee =
  exports.updateEmployee =
  exports.addEmployee =
  exports.getJobs =
    void 0;
const Employee_1 = __importDefault(require("../Model/Employee"));
const logger_1 = __importDefault(require("../logger"));
const Job_1 = __importDefault(require("../Model/Job"));
const auth_1 = require("../Middleware/auth");
const Month_1 = require("../Model/Month");
const sequelize_typescript_1 = require("sequelize-typescript");
const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const jobs = await Job_1.default.findAll({
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job_1.default.count(); // Get the total number of employees
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
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error finding jobs", err });
  }
};
exports.getJobs = getJobs;
const addEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = (0, auth_1.encryptedPassword)(password);
    console.log(hashedPassword);
    const newEmployee = await Employee_1.default.create({
      username: name,
      email: email,
      password: hashedPassword,
      role: role,
    });
    logger_1.default.info("Employee created");
    res
      .status(201)
      .json({ message: "Employee added successfully", Employee: newEmployee });
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error adding user", error: err });
  }
};
exports.addEmployee = addEmployee;
const updateEmployee = async (req, res) => {
  const { id, name, email, password, role } = req.body;
  try {
    const hashedPassword = (0, auth_1.encryptedPassword)(password);
    const updateEmployee = await Employee_1.default.update(
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
    logger_1.default.info("Employee updated");
    res
      .status(200)
      .json({ message: "Employee updated successfully", updateEmployee });
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error updating employee", err });
  }
};
exports.updateEmployee = updateEmployee;
const findAllEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const employees = await Employee_1.default.findAll({
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Employee_1.default.count(); // Get the total number of employees
    const totalPages = Math.ceil(totalEmployees / limit);
    const employeeData = employees.map((row) => {
      const password = row.dataValues.password
        ? (0, auth_1.decryptPassword)(row.dataValues.password)
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
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error finding employee", err });
  }
};
exports.findAllEmployee = findAllEmployee;
const deleteEmployee = async (req, res) => {
  const { id } = req.body;
  try {
    const deleted = await Employee_1.default.destroy({
      where: { id },
    });
    if (deleted) {
      logger_1.default.info(`Employee with id ${id} deleted successfully`);
      return res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      logger_1.default.error(`Employee with id ${id} not found`);
      return res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
      return res
        .status(500)
        .json({ message: "Error deleting employee", error: err.message });
    }
    return res
      .status(500)
      .json({ message: "Unknown error occurred while deleting employee" });
  }
};
exports.deleteEmployee = deleteEmployee;
const getMonthlyJobCounts = async (req, res) => {
  try {
    const results = await Month_1.Month.findAll({
      attributes: [
        [
          sequelize_typescript_1.Sequelize.fn(
            "COUNT",
            sequelize_typescript_1.Sequelize.col("jobs.id"),
          ),
          "total_jobs_on_each_month",
        ],
      ],
      include: [
        {
          model: Job_1.default,
          attributes: [], // We don't need to select any specific job fields here
          required: false, // LEFT JOIN behavior
          where: {
            year: "2024",
          },
        },
      ],
      group: ["Month.month_name"],
      order: [["id", "ASC"]],
    });
    res.status(200).json(results);
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res
      .status(500)
      .json({ message: "Error fetching job counts by month", err });
  }
};
exports.getMonthlyJobCounts = getMonthlyJobCounts;
const getEmployeeInfoAndEmployeeJobInfo = async (req, res) => {
  const { employeeJobId, employeeId } = req.body;
  try {
    // Fetch the employee information using employeeId
    const employeeInfo = await Employee_1.default.findByPk(employeeId);
    console.log("employeeInfo", employeeInfo);
    // Fetch the employee job information using employeeJobId
    const employeeJobInfo = await Job_1.default.findByPk(employeeJobId);
    console.log("employeeJobInfo", employeeJobInfo);
    // Check if both employeeInfo and employeeJobInfo exist
    if (!employeeInfo || !employeeJobInfo) {
      return res.status(404).json({
        message: "Employee or Employee Job not found",
      });
    }
    // If both exist, return the information
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
exports.getEmployeeInfoAndEmployeeJobInfo = getEmployeeInfoAndEmployeeJobInfo;
