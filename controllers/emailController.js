const { fetchGmailEmails, sendAutomatedResponse } = require('../services/emailService');
const { analyzeContent } = require('../services/openaiService');
const { storeTokens } = require('../services/tokenService');
const handleEmails = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user;
    console.log('Storing Token...');
    const vlgg =await storeTokens(accessToken,refreshToken);
    console.log('StoredToken...');
    console.log('Fetching Gmail emails...');
    const gmailEmails = await fetchGmailEmails(accessToken, refreshToken);
    console.log('Gmail emails: fetched');

    for (const email of gmailEmails) {
      const category = await analyzeContent(email.content);
      await sendAutomatedResponse(email.sender, category);
      console.log(`Sent automated response to ${email.sender}, email ID: ${responseInfo.emailId}, response: ${responseInfo.responseMessage}`);
    }

    res.status(200).send('Emails processed successfully');
  } catch (error) {
    console.error('Error processing emails:', error);
    res.status(500).send('Error processing emails');
  }
};

module.exports = { handleEmails };
