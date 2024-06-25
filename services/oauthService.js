// oauthService.js
const passport = require('./passport'); // Import the configured passport instance

// Middleware for Google OAuth authentication
const googleAuthMiddleware = passport.authenticate('google', { scope: ['profile', 'email'] });

// Middleware for Google OAuth callback
const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });



module.exports = { googleAuthMiddleware, googleAuthCallback };
