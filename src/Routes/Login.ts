import express from "express";
import { login, requestPasswordReset } from "../Controller/LoginController";

const router = express.Router();

router.post("/login", login);
router.post("/forgetPassword", requestPasswordReset);
export default router;
