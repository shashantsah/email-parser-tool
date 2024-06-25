# Email Parser Tool

This project is an email parser tool that connects to Gmail and Outlook, reads emails, analyzes their content using OpenAI, categorizes them, and sends automated responses.

## Setup

1. Clone the repository:
    ```sh
    git clone <repository_url>
    cd email-parser-tool
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```plaintext
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    OUTLOOK_CLIENT_ID=your_outlook_client_id
    OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
    GMAIL_USER=your_gmail_user
    GMAIL_PASS=your_gmail_password
    OPENAI_API_KEY=your_openai_api_key
    PORT=3000
    SESSION_SECRET=your_session_secret
    ```

4. Start the server:
    ```sh
    node server.js
    ```

5. Authenticate with Gmail and Outlook:
    - Navigate to `http://localhost:3000/auth/google`
    - Navigate to `http://localhost:3000/auth/outlook`

6. The app will automatically fetch unread emails, analyze their content, categorize them, and send automated responses.

## Technologies Used

- Node.js
- Express
- Passport.js
- BullMQ
- Google APIs
- Microsoft Graph API
- OpenAI API
- Nodemailer
