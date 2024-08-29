import express from "express";
import { authenticateJWT, authorizeRole } from "../Middleware/auth";
import {
  addLeads,
  getLeads,
  updateLeads,
} from "../Controller/EmployeeController";

const router = express.Router();
router.get("/dashboard", authenticateJWT, getLeads, authorizeRole("employee"));
router.post("/add-job", addLeads, authorizeRole("employee"));
router.post(
  "/updateLeads",
  authenticateJWT,
  updateLeads,
  authorizeRole("employee"),
);

export default router;
