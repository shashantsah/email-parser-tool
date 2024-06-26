const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify'
];

const fetchGmailEmails = async (accessToken, refreshToken) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    scope: SCOPES.join(' '),
    token_type: 'Bearer',
    expiry_date: (new Date()).getTime() + 3600 * 1000,
  });

  if (oauth2Client.isTokenExpiring()) {
    try {
      const tokens = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(tokens.credentials);
      console.log('Storing Token from emailservices');
    const vlgg =await storeTokens(tokens.credentials.access_token,tokens.credentials.refresh_token);
    console.log('StoredTokenf from emailservices');
    } catch (error) {
      throw new Error('Failed to refresh access token');
    }
  }
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });

  const emails = await Promise.all(res.data.messages.map(async (msg) => {
    const msgDetails = await gmail.users.messages.get({ userId: 'me', id: msg.id });

    if (msgDetails.data.payload.parts) {
      const emailData = msgDetails.data.payload.parts.find(part => part.mimeType === 'text/plain');
      return {
        id: msg.id,
        sender: msgDetails.data.payload.headers.find(header => header.name === 'From').value,
        content: emailData ? Buffer.from(emailData.body.data, 'base64').toString('utf-8') : '',
      };
    } else {
      return {};
    }
  }));

  return emails.filter(email => Object.keys(email).length !== 0);
};

const sendAutomatedResponse = async (recipient, category) => {
  let response;
  switch (category) {
    case 'Interested':
      response = "We are excited to hear your interest! Are you available for a demo call? Please suggest a suitable time.";
      break;
    case 'Not Interested':
      response = "Thank you for your time. Let us know if you have any questions in the future.";
      break;
    case 'More information':
      response = "We would be happy to provide more information. What specific details are you looking for?";
      break;
    default:
      response = "Thank you";
      break;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: 'Automated Response',
    text: response,
  });

  console.log(`Sent automated response to ${recipient}, response: ${response}`);
};


module.exports = { fetchGmailEmails, sendAutomatedResponse};
