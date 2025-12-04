import nodemailer from "nodemailer";

// Create reusable transporter object using Gmail SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email template for admin notification (full form details)
export const sendAdminNotification = async (formData: {
  name: string;
  email: string;
  phone?: string;
  year?: string;
  location?: string;
  language?: string;
  story: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: `New Contact Form Submission from ${formData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p>You’ve received a new story submission from your website contact form.</p>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 16px;">
          <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          ${
            formData.phone
              ? `<p><strong>Phone:</strong> ${formData.phone}</p>`
              : ""
          }
          ${
            formData.year
              ? `<p><strong>Year / Age:</strong> ${formData.year}</p>`
              : ""
          }
          ${
            formData.location
              ? `<p><strong>Location:</strong> ${formData.location}</p>`
              : ""
          }
          ${
            formData.language
              ? `<p><strong>Language Preference:</strong> ${formData.language}</p>`
              : ""
          }

          <h3 style="margin-top: 24px; color: #333;">Story</h3>
          <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 3px; line-height: 1.5;">
            ${formData.story}
          </p>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

// Email template for user confirmation
export const sendUserConfirmation = async (
  userEmail: string,
  userName: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: "Thank you for contacting Laberge Casting",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for sharing your story with us</h2>
        <p>Dear ${userName || "there"},</p>
        <p>Thank you for sending us your details and taking the time to tell your story.</p>
        <p>We've received your information and our team will review it carefully. We’ll reach out to you soon if we have any questions or next steps.</p>
        <p style="margin-top: 16px;">If you feel you forgot something or want to add more details, you can simply reply to this email.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            <strong>Laberge Casting Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

// Verify transporter configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
