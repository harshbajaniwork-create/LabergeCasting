import { type ActionFunctionArgs, data } from "react-router";
import { sendAdminNotification, sendUserConfirmation } from "../lib/email";

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

    // Send emails in parallel
    await Promise.all([
      sendAdminNotification({
        name,
        email,
        phone: [countryCode, phone].filter(Boolean).join(" "),
        year,
        location,
        language,
        story,
      }),
      sendUserConfirmation(email, name),
    ]);

    return data({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return data({ error: "Failed to send emails" }, { status: 500 });
  }
}
