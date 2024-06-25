require('dotenv').config(); // Load environment variables
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const { fetchGmailEmails, sendAutomatedResponse } = require('./emailService');
const { analyzeContent } = require('./openaiService');
const { google } = require('googleapis');
const { getStoredTokens } = require('./tokenService');


const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify'
];
// Create a connection to your Redis server
const connection = new IORedis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

// Create a Queue with the connection
const emailQueue = new Queue('emailQueue', { connection });

const scheduleEmailCheck = async () => {
  await emailQueue.add('checkEmails', {}, { repeat: { cron: '*/5 * * * *' } }); // Every 5 minutes
};

// Worker to process the emails
const worker = new Worker('emailQueue', async job => {
  switch (job.name) {
    case 'checkEmails':
      await processEmails();
      break;
    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}, { connection });

// Function to process the emails
const processEmails = async () => {
  try {
    const { accessToken, refreshToken } = await getStoredTokens();
    const gmailEmails = await fetchGmailEmails(accessToken, refreshToken);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const email of gmailEmails) {
      await delay(10000);
      const category = await analyzeContent(email.content);
      // await sendAutomatedResponse(email.sender, category);
       await markEmailAsRead(email.id, accessToken, refreshToken);
     
    }

    console.log('Emails processed successfully');
  } catch (error) {
    console.error('Error processing emails:', error);
  }
};

const markEmailAsRead = async (emailId, accessToken, refreshToken) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URL
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    scope: SCOPES.join(' '),
    token_type: 'Bearer',
    expiry_date: (new Date()).getTime() + 3600 * 1000,
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  await gmail.users.messages.modify({
    userId: 'me',
    id: emailId,
    resource: {
      removeLabelIds: ['UNREAD']
    }
  });
};

// Start the email check process
scheduleEmailCheck();

module.exports = { emailQueue, scheduleEmailCheck };
