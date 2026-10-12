# Email Alerts on WhatsApp

An automated email notification system built with Node.js, Gmail IMAP, and the Twilio WhatsApp API. The application monitors unread emails and sends WhatsApp notifications containing the sender, subject, and a short preview of the email body.

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Initialize the Project

```bash
npm init -y
```

### 3. Install Dependencies

```bash
npm install imap-simple mailparser string-strip-html twilio node-cron dotenv
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-gmail-app-password

TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_TO=whatsapp:+91XXXXXXXXXX
```

Replace the example values with your own configuration locally. Never commit your `.env` file to a public repository.

For Gmail, use an appropriate App Password where required. For WhatsApp messaging, configure the Twilio WhatsApp Sandbox or an approved WhatsApp sender.

### 5. Run the Application

Save the main script as `index.js` and run:

```bash
node index.js
```

The application checks for unread emails when it starts and then schedules additional checks every minute.

## How It Works

1. Connects to the Gmail inbox using IMAP.
2. Searches for unread emails.
3. Retrieves email headers and message content.
4. Extracts the sender, subject, and readable email body using Mailparser.
5. Converts HTML content to readable text when plain text is unavailable.
6. Creates a WhatsApp notification with the email details and a short body preview.
7. Sends the notification through the Twilio WhatsApp API.
8. Retries email-fetching operations when errors occur.

## Features

- **Automated Email Monitoring:** Checks the inbox for unread messages.
- **Email Content Extraction:** Retrieves sender details, subjects, and message bodies.
- **WhatsApp Notifications:** Sends email alerts through Twilio.
- **Message Preview:** Includes up to 200 characters of the email body.
- **Scheduled Execution:** Checks for new emails every minute using Node Cron.
- **Retry Mechanism:** Retries failed email-fetching operations.
- **HTML Email Processing:** Extracts readable text from HTML emails when necessary.
- **Immediate Startup Check:** Runs an initial email check when the application starts.

## Tech Stack

| Layer | Technology |
|---|---|
| Programming Language | JavaScript |
| Runtime | Node.js |
| Email Protocol | IMAP |
| Email Provider | Gmail |
| Email Client | imap-simple |
| Email Parsing | mailparser |
| HTML Processing | string-strip-html |
| Messaging Integration | Twilio WhatsApp API |
| Task Scheduling | node-cron |
| Environment Configuration | dotenv |

## Twilio WhatsApp Integration

The application uses the Twilio API to send WhatsApp notifications.

The sender and recipient are configured through environment variables:

```env
WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_TO=whatsapp:+91XXXXXXXXXX
```

The example sender represents the standard Twilio WhatsApp Sandbox number. Sandbox recipients must meet Twilio's participation requirements. Production messaging may require an approved WhatsApp sender and compliance with applicable messaging policies.

The project also demonstrates sending template-based WhatsApp messages using the Twilio REST API with `ContentSid` and `ContentVariables`.

## Project Structure

```text
Email-Alerts-on-WhatsApp/
├── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Error Handling

- Logs email connection and processing errors.
- Retries failed email-fetching operations up to three attempts.
- Logs WhatsApp message-sending errors.
- Skips messages when the expected email body is unavailable.

## Security

- Stores credentials in environment variables instead of source code.
- Excludes `.env` and `node_modules/` from version control.
- Avoids publishing email addresses, phone numbers, account identifiers, and authentication tokens.
- Uses secure connection settings for email communication.
- Requires exposed credentials to be rotated before public release.

Add the following entries to `.gitignore`:

```gitignore
.env
node_modules/
```

## Future Improvements

- Prevent duplicate notifications by tracking processed email IDs.
- Support multiple email accounts.
- Add configurable polling intervals.
- Improve logging and delivery-status tracking.
- Add automated tests for email processing and message sending.
- Support email attachments and richer notification summaries.

## License

Add an appropriate license if you plan to distribute this project publicly.
