"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../Middleware/auth");
const EmployeeController_1 = require("../Controller/EmployeeController");
const router = express_1.default.Router();
router.get(
  "/dashboard",
  auth_1.authenticateJWT,
  EmployeeController_1.getLeads,
  (0, auth_1.authorizeRole)("employee"),
);
router.post(
  "/add-job",
  EmployeeController_1.addLeads,
  (0, auth_1.authorizeRole)("employee"),
);
router.post(
  "/updateLeads",
  auth_1.authenticateJWT,
  EmployeeController_1.updateLeads,
  (0, auth_1.authorizeRole)("employee"),
);
exports.default = router;
