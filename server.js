require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { scheduleEmailCheck } = require('./services/bullmqService');
const emailRoutes = require('./routes/emailRoutes');
require('./config/passport');

const app = express();

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', emailRoutes);


let serverStarted = false; // Flag to track if server has started

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (!serverStarted) {
    console.log(`Server is running on port ${PORT}`);
    scheduleEmailCheck();
    serverStarted = true;
  }
});








