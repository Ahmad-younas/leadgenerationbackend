import express from "express";
import {
  login,
  requestPasswordReset,
  resetPassword,
} from "../Controller/LoginController";

const router = express.Router();

router.post("/login", login);
router.post("/forgetPassword", requestPasswordReset);
router.post("/resetPassword", resetPassword);
export default router;
