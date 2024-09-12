import express from "express";
import { authorizeRole } from "../Middleware/auth";
import {
  addEmployee,
  deleteEmployee,
  findAllEmployee,
  getEmployeeInfoAndEmployeeJobInfo,
  getEmployeeWithJobInfo,
  getJobs,
  getMonthlyJobCounts,
  updateEmployee,
} from "../Controller/AdminController";

const router = express.Router();

router.get("/all-jobs", getJobs, authorizeRole("admin"));
router.post("/add-employee", addEmployee, authorizeRole("admin"));
router.patch("/update-employee", updateEmployee, authorizeRole("admin"));
router.get("/all-employee", findAllEmployee, authorizeRole("admin"));
router.delete("/delete-employee", deleteEmployee, authorizeRole("admin"));
router.get(
  "/get-monthly-count-job",
  getMonthlyJobCounts,
  authorizeRole("admin"),
);
router.post(
  "/get-Employee-Info-And-Employee-Job-Info",
  getEmployeeInfoAndEmployeeJobInfo,
  authorizeRole("admin"),
);

router.get(
  "/getEmployeeWithJobInfo",
  getEmployeeWithJobInfo,
  authorizeRole("admin"),
);

export default router;
