import { Request, Response } from "express";
import User from "../Model/User";
import jwt from "jsonwebtoken";
import logger from "../logger";
import crypto from "crypto";
import { decryptPassword } from "../Middleware/auth";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("login", email, password);

  try {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    const userId = user.dataValues.id;
    const hashedPassword = user.dataValues.password;
    const userRole = user.dataValues.role;
    const isPasswordMatch = decryptPassword(hashedPassword);
    if (isPasswordMatch === password) {
      const token = jwt.sign(
        { id: userId, role: userRole },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );
      logger.info("Token Sent Successfully ");
      return res.json({ token });
    } else {
      return res.status(401).send("Invalid Credentials");
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    return res.status(500).send("Database error" + err);
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    // await user.save();
    //
    // sendResetPasswordEmail(user.email, token);
    res.json({ message: "Reset password email sent" });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message); // TypeScript now knows err is an Error
    } else {
      logger.error("An unknown error occurred");
    }
    res.status(500).json({ message: "Server error", error: String(err) });
  }
};
