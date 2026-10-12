const accountSid = 'AC8f674e33ec6631af0b3e070f336501c6';
const authToken = 'a64a8ef0f1d36c623d589e84faddc531';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+917989314354',
    body: 'This is a test message from Twilio WhatsApp Sandbox!',
  })
  .then(message => console.log('Message sent! SID:', message.sid))
  .catch(error => console.error('Error:', error));
