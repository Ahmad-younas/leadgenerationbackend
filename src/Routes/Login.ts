import express from "express";
import { login } from "../Controller/LoginController";

const router = express.Router();

router.post("/login", login);
export default router;
