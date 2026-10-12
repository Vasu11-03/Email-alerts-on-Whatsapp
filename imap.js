const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { stripHtml } = require('string-strip-html'); 
const twilio = require('twilio');
const cron = require('node-cron');

const emailConfig = {
  imap: {
    user: 'miniproject25459@gmail.com',
    password: 'wyer qnkc dzhf epmj', 
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }, 
    authTimeout: 30000, // Increased timeout for slow connections
  },
};

const accountSid = 'AC5f96fb63e7ede18259bf788fc7fc91ff';
const authToken = 'e375f52a034ccf09b329688c3ae75cf8';
const client = twilio(accountSid, authToken);
const fromWhatsAppNumber = 'whatsapp:+14155238886';
const toWhatsAppNumber = 'whatsapp:+917989314354';

async function fetchEmails() {
  try {
    const connection = await imaps.connect(emailConfig);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      markSeen: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const message of messages) {
      const body = message.parts.find((part) => part.which === 'TEXT');
      if (!body?.body) {
        console.error('No body found for this email. Skipping...');
        continue;
      }

      const parsed = await simpleParser(body.body);
      const emailFrom = parsed.from?.text || 'Unknown Sender';
      const emailSubject = parsed.subject || 'No Subject';
      let emailBody = parsed.text || '';
      if (!emailBody && parsed.html) {
        emailBody = stripHtml(parsed.html).result;
      }
      emailBody = emailBody.trim();

      console.log(`From: ${emailFrom}`);
      console.log(`Subject: ${emailSubject}`);
      console.log(`Body: ${emailBody}`);

      await sendWhatsAppMessage(emailFrom, emailSubject, emailBody);
    }

    connection.end();
  } catch (error) {
    console.error('Error fetching or processing emails:', error.message);
    throw error; // Rethrow for retry logic
  }
}

async function fetchEmailsWithRetry(retries = 3) {
  while (retries > 0) {
    try {
      await fetchEmails();
      return;
    } catch (error) {
      retries -= 1;
      console.error(`Retrying... (${3 - retries} retries left)`);
      if (retries === 0) {
        console.error('All retries failed:', error.message);
      }
    }
  }
}

async function sendWhatsAppMessage(emailFrom, emailSubject, emailBody) {
  const message = `📨 *New Email Alert!* 📨\n\n` +
                  `*From:* ${emailFrom}\n` +
                  `*Subject:* ${emailSubject}\n\n` +
                  `*Body:* ${emailBody.substring(0, 200)}...\n\n` +
                  `🔗 Check your email for details.`;

  try {
    const response = await client.messages.create({
      from: fromWhatsAppNumber,
      to: toWhatsAppNumber,
      body: message,
    });
    console.log('WhatsApp message sent:', response.sid);
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error.message);
  }
}

// Schedule to run every minute
cron.schedule('* * * * *', async () => {
  console.log('Checking for new emails...');
  await fetchEmailsWithRetry();
});

// Run immediately when the script starts
(async () => {
  console.log('Starting email-to-WhatsApp service...');
  await fetchEmailsWithRetry();
})();
