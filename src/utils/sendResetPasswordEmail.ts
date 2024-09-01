import nodemailer from "nodemailer";
import logger from "../logger"; // Adjust this import according to your logger setup

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., 'Gmail', 'Yahoo', 'Outlook'
  auth: {
    user: "ahyounas2k22@gmail.com", // Your email address
    pass: "zklqaankkxrrlonq", // Your email password or app-specific password
  },
});

/**
 * Sends a password reset email to the user.
 * @param to - The recipient's email address
 * @param token - The password reset token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (
  to: string,
  token: string,
): Promise<void> => {
  try {
    const resetUrl = process.env.RESETURL + `${token}`; // Replace with your frontend URL
    const expirationMinutes = 15; // Token expiration time
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + expirationMinutes * 60000,
    ); // Replace with your frontend URL
    const mailOptions = {
      from: "ahyounas2k22@gmail.com", // Sender address
      to: to, // Recipient address
      subject: "Password Reset Request",
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Email</title>
    <style>
        /* CSS styling for the email */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }

        .header {
            background-color: #20263A;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }

        .header img {
            max-width: 100px;
        }

        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }

        .content h2 {
            margin: 0 0 10px;
            font-size: 24px;
            color: #20263A;
        }

        .content p {
            font-size: 14px;
            line-height: 1.6;
            color: #666666;
        }

        .button {
            margin: 20px 0;
        }

        .button a {
            background-color: #20263A;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
        }

        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999999;
        }

        .footer p {
            margin: 5px 0;
        }

        .footer .social-icons {
            margin-top: 10px;
        }

        .social-icons img {
            width: 24px;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header section -->
        <div class="header">
            <img src="https://yourdomain.com/path/to/logo.png" alt="Your Logo">
            <h2>Please reset your password</h2>
        </div>

        <!-- Content section -->
        <div class="content">
            <p>Hello,</p>
            <p>We have sent you this email in response to your request to reset your password on our website.</p>
            <p>To reset your password, please follow the link below:</p>

            <div class="button">
                <a href="http://yourfrontend.com/reset-password?token=yourtoken">Reset Password</a>
            </div>

            <p>Please ignore this email if you did not request a password change.</p>
        </div>

        <!-- Footer section -->
        <div class="footer">
            <p>Contact</p>
            <p>1912 Mcwhorter Road, FL 11223<br>+111 222 333 | info@company.com</p>
            <div class="social-icons">
                <a href="#"><img src="https://yourdomain.com/path/to/facebook-icon.png" alt="Facebook"></a>
                <a href="#"><img src="https://yourdomain.com/path/to/twitter-icon.png" alt="Twitter"></a>
                <a href="#"><img src="https://yourdomain.com/path/to/instagram-icon.png" alt="Instagram"></a>
                <a href="#"><img src="https://yourdomain.com/path/to/linkedin-icon.png" alt="LinkedIn"></a>
            </div>
            <p>Company © All Rights Reserved</p>
        </div>
    </div>
</body>
</html>

      `,
    };
    // Send the email
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${to}`);
  } catch (err) {
    logger.error(`Error sending password reset email to ${to}: ${err}`);
    throw new Error("Failed to send password reset email");
  }
};
