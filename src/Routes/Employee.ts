import express from "express";
import { authenticateJWT, authorizeRole } from "../Middleware/auth";
import {
  addLeads,
  getIndividualEmployeeWithJobInfo,
  getJobInfoOfEmployee,
  getJobInfoOfEmployeeWithPagination,
  getLeads,
  getMonthlyJobCountOfEmployee,
  getStatusCountOfJobs,
  updateLeads,
} from "../Controller/EmployeeController";

const router = express.Router();
router.get("/dashboard", authenticateJWT, getLeads, authorizeRole("employee"));
router.post("/add-job", addLeads, authorizeRole("employee"));
router.post("/updateLeads", updateLeads, authorizeRole("employee"));
router.get(
  "/getJobInfoOfEmployee/:id",
  getJobInfoOfEmployee,
  authorizeRole("employee"),
);
router.get(
  "/getJobInfoOfEmployeeWithPagination",
  getJobInfoOfEmployeeWithPagination,
  authorizeRole("employee"),
);

router.post(
  "/getIndividualEmployeeWithJobInfo",
  getIndividualEmployeeWithJobInfo,
  authorizeRole("employee"),
);
router.get(
  "/getMonthlyJobCountOfEmployee",
  getMonthlyJobCountOfEmployee,
  authorizeRole("employee"),
);

router.get(
  "/getStatusCountOfJobs",
  getStatusCountOfJobs,
  authorizeRole("employee"),
);

export default router;
