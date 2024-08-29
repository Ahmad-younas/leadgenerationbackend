"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../Middleware/auth");
const AdminController_1 = require("../Controller/AdminController");
const router = express_1.default.Router();
router.get("/dashboard", auth_1.authenticateJWT, AdminController_1.getLeads, (0, auth_1.authorizeRole)("admin"));
router.post("/add-employee", auth_1.authenticateJWT, AdminController_1.addEmployee, (0, auth_1.authorizeRole)("admin"));
exports.default = router;
