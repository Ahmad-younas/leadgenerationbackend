import { Request, Response } from "express";
import User from "../Model/User";
import jwt from "jsonwebtoken";
import logger from "../logger";
import { decryptPassword } from "../Middleware/auth";
import { Employee } from "../Model/model";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail";
import crypto from "crypto";
import bycrypt from "bcrypt";

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
    const user = await Employee.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log(user);

    const StringToken = crypto.randomBytes(20).toString("hex");
    const token = await bycrypt.hash(StringToken, 10);
    // user.resetPasswordToken = StringToken;
    // user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    console.log(user.resetPasswordToken);
    console.log(user.resetPasswordExpires);
    // await user.save();
    try {
      user.setDataValue("resetPasswordToken", token);
      user.setDataValue("resetPasswordExpires", new Date(Date.now() + 3600000)); // 1 hour from now

      await user.save();

      console.log("User saved successfully");
    } catch (error) {
      console.error("Error saving user:", error);
    }
    //
    await sendResetPasswordEmail("ahmadyounas2k18@gmail.com", token);
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
