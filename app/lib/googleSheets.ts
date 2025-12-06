import { google } from "googleapis";

// Interface for form data that will be saved to Google Sheets
interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  year?: string;
  location?: string;
  language?: string;
  story: string;
  submittedAt: string;
}

// Initialize Google Sheets API
const initializeGoogleSheets = () => {
  try {
    // Parse the service account key from environment variable
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"
      );
    }

    const credentials = JSON.parse(serviceAccountKey);

    // Create JWT client for authentication
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Initialize the Sheets API
    const sheets = google.sheets({ version: "v4", auth });

    return sheets;
  } catch (error) {
    console.error("Error initializing Google Sheets:", error);
    throw error;
  }
};

// Function to append form data to Google Sheets
export const appendToGoogleSheet = async (
  formData: Omit<FormSubmissionData, "submittedAt">
) => {
  try {
    const sheets = initializeGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID environment variable is not set");
    }

    // Prepare the data row
    const submissionData: FormSubmissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    // Convert form data to array format for Google Sheets
    // Prefix phone number with single quote to force text formatting and prevent parse errors
    const phoneValue = submissionData.phone ? `'${submissionData.phone}` : "";

    const values = [
      [
        submissionData.submittedAt,
        submissionData.name,
        submissionData.email,
        phoneValue,
        submissionData.year || "",
        submissionData.location || "",
        submissionData.language || "",
        submissionData.story,
      ],
    ];

    // Get the first sheet name dynamically
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    const sheetName =
      spreadsheetInfo.data.sheets?.[0]?.properties?.title || "Sheet1";

    // Append the data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:H`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    console.log("Successfully added data to Google Sheets:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error appending to Google Sheets:", error);
    throw error;
  }
};

// Function to create headers in the Google Sheet (run this once to set up the sheet)
export const createSheetHeaders = async () => {
  try {
    const sheets = initializeGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID environment variable is not set");
    }

    // First, get the spreadsheet info to check sheet names
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetName =
      spreadsheetInfo.data.sheets?.[0]?.properties?.title || "Sheet1";
    console.log(`Using sheet name: ${sheetName}`);

    const headers = [
      [
        "Submitted At",
        "Name",
        "Email",
        "Phone",
        "Year/Age",
        "Location",
        "Language Preference",
        "Story",
      ],
    ];

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:H1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: headers,
      },
    });

    console.log(
      "Successfully created headers in Google Sheets:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating headers in Google Sheets:", error);
    throw error;
  }
};

// Function to get all submissions from the sheet (optional utility)
export const getSubmissions = async () => {
  try {
    const sheets = initializeGoogleSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID environment variable is not set");
    }

    // Get the first sheet name dynamically
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    const sheetName =
      spreadsheetInfo.data.sheets?.[0]?.properties?.title || "Sheet1";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:H`,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Error getting submissions from Google Sheets:", error);
    throw error;
  }
};
