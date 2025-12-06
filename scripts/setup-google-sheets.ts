import { createSheetHeaders } from "../app/lib/googleSheets";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), ".env");
    const envFile = readFileSync(envPath, "utf8");

    envFile.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=");
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.error("Error loading .env file:", error);
    process.exit(1);
  }
}

/**
 * Setup script to initialize Google Sheets with proper headers
 * Run this once after setting up your Google Sheets integration
 */
async function setupGoogleSheets() {
  try {
    console.log("Setting up Google Sheets headers...");
    await createSheetHeaders();
    console.log("✅ Google Sheets headers created successfully!");
    console.log("Your sheet is now ready to receive form submissions.");
  } catch (error) {
    console.error("❌ Error setting up Google Sheets:", error);
    process.exit(1);
  }
}

// Load environment variables and run the setup
loadEnvFile();
setupGoogleSheets();
