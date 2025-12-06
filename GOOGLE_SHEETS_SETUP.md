# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration to automatically store form submissions from your Laberge Casting website.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. A Google Sheets document where you want to store the form data

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `laberge-casting-sheets`
   - Description: `Service account for Laberge Casting form submissions`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Service Account Key

1. In the "Credentials" page, find your newly created service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Choose "JSON" format and click "Create"
6. A JSON file will be downloaded - keep this safe!

## Step 5: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Laberge Casting Form Submissions"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 6: Share the Sheet with Service Account

1. In your Google Sheet, click the "Share" button
2. Add the service account email (found in the JSON file as `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

## Step 7: Set Up Environment Variables

1. Copy `.env.example` to `.env` in your project root (if not already done)
2. Fill in the Google Sheets configuration:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your-sheet-id-from-step-5
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...} # Paste the entire JSON content from step 4
```

**Important**:

- The `GOOGLE_SERVICE_ACCOUNT_KEY` should be the entire JSON object as a single line string.
- Do NOT include quotes around the Sheet ID
- Make sure there are no line breaks in the JSON string

## Step 8: Initialize Sheet Headers

Run the setup script to create the proper headers in your Google Sheet:

```bash
npx tsx scripts/setup-google-sheets.ts
```

This will create the following columns in your sheet:

- Submitted At
- Name
- Email
- Phone
- Year/Age
- Location
- Language Preference
- Story

## Step 9: Test the Integration

1. Start your development server: `npm run dev`
2. Fill out and submit the contact form on your website
3. Check your Google Sheet - you should see the new submission appear!

## Troubleshooting

### Common Issues

1. **"Error: GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"**
   - Make sure you've copied the entire JSON content to your `.env` file
   - Ensure there are no line breaks in the JSON string
   - Verify the script is loading the `.env` file correctly

2. **"Error: GOOGLE_SHEET_ID environment variable is not set"**
   - Double-check that you've copied the correct Sheet ID from the URL
   - Make sure there are no quotes around the Sheet ID in the `.env` file

3. **"The caller does not have permission"**
   - Make sure you've shared the Google Sheet with the service account email
   - Verify the service account has "Editor" permissions

4. **"Unable to parse range" or "Requested entity was not found"**
   - Make sure your sheet is named "Sheet1" or update the range in the code
   - Verify the Sheet ID is correct and doesn't have quotes around it
   - Run the setup script to create proper headers

5. **Phone number parse errors (like +91 country codes)**
   - The integration automatically handles this by prefixing phone numbers with a single quote
   - This forces Google Sheets to treat phone numbers as text instead of formulas

### Security Notes

- Never commit your `.env` file to version control
- Keep your service account JSON key secure
- Consider using environment-specific service accounts for production

## Sheet Structure

Your Google Sheet will have the following columns:

| Column | Description              |
| ------ | ------------------------ |
| A      | Submitted At (timestamp) |
| B      | Name                     |
| C      | Email                    |
| D      | Phone                    |
| E      | Year/Age                 |
| F      | Location                 |
| G      | Language Preference      |
| H      | Story                    |

## Additional Features

The integration includes these utility functions:

- `appendToGoogleSheet()` - Adds new form submission
- `createSheetHeaders()` - Sets up column headers
- `getSubmissions()` - Retrieves all submissions (for admin use)

You can extend these functions as needed for your specific requirements.

## Technical Implementation Details

### JWT Authentication Fix

The integration uses the modern Google APIs JWT constructor format:

```typescript
const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
```

### Phone Number Handling

Phone numbers with country codes (like `+91`) are automatically prefixed with a single quote to prevent Google Sheets parse errors:

```typescript
const phoneValue = submissionData.phone ? `'${submissionData.phone}` : "";
```

### Environment Variable Loading

The setup script includes custom environment variable loading to ensure `.env` files are properly read in all environments.

## Dependencies

Make sure you have the required dependencies installed:

```bash
npm install googleapis
```

The integration is compatible with:

- Node.js (ES modules)
- TypeScript
- React Router v7
- Modern Google APIs library
