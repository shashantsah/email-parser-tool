const express = require('express');
const passport = require('passport');
const { handleEmails } = require('../controllers/emailController');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  (req, res) => {
    res.redirect('/auth/process-emails');
  });


router.get('/process-emails', (req, res) => {
    handleEmails(req,res);
  });

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = router;
