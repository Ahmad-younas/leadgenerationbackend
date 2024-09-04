import { Request, Response } from "express";
import User from "../Model/User";
import jwt from "jsonwebtoken";
import logger from "../logger";
import { decryptPassword, encryptedPassword } from "../Middleware/auth";
import { Employee } from "../Model/model";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail";
import crypto from "crypto";
import bcrypt from "bcrypt";

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

    const StringToken = crypto.randomBytes(20).toString("hex");
    const token = await bcrypt.hash(StringToken, 10);

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

/**
 * Resets the user's password using the reset token.
 * @param req - Express request object
 * @param res - Express response object
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body; // Get the token and new password from the request body

  try {
    // Find the user by reset token
    const user = await Employee.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid or expired reset token" });
    }

    // Check if the reset token has expired
    if (user.resetPasswordExpires && user.resetPasswordExpires <= new Date()) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Hash the new password
    const hashedPassword = encryptedPassword(newPassword);
    // Update the user's password and clear the reset token/expiry
    user.setDataValue("password", hashedPassword);
    user.setDataValue("resetPasswordToken", null);
    user.setDataValue("resetPasswordExpires", null);

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
