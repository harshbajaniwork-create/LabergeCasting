import { type ActionFunctionArgs, data } from "react-router";
import { sendAdminNotification, sendUserConfirmation } from "../lib/email";
import { appendToGoogleSheet } from "../lib/googleSheets";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const countryCode = (formData.get("countryCode") as string) || "";
    const phone = formData.get("phone") as string;
    const year = formData.get("year") as string;
    const location = formData.get("location") as string;
    const story = formData.get("story") as string;
    const language = formData.get("language") as string;

    if (!name || !email || !story) {
      return data({ error: "Missing required fields" }, { status: 400 });
    }

    const phoneNumber = [countryCode, phone].filter(Boolean).join(" ");

    // Prepare data for Google Sheets
    const submissionData = {
      name,
      email,
      phone: phoneNumber,
      year,
      location,
      language,
      story,
    };

    // Always save to Google Sheets
    await appendToGoogleSheet(submissionData);

    // Try to send emails, but don't fail if email service is down
    try {
      await Promise.all([
        sendAdminNotification(submissionData),
        sendUserConfirmation(email, name),
      ]);
      return data({
        success: true,
        message: "Form submitted successfully! Confirmation email sent.",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return data({
        success: true,
        message:
          "Form submitted successfully! (Email notification failed, but your submission was saved)",
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return data({ error: "Failed to send emails" }, { status: 500 });
  }
}
