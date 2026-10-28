PERSONAL PORTFOLIO WEBSITE — DATABASE VERSION
=============================================

Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: SQLite (stored locally in backend/portfolio.db)

Run on macOS
------------
1. Install Node.js LTS if it is not installed:
   https://nodejs.org/
2. Open Terminal.
3. Change directory into this extracted project's backend folder. Example:
   cd ~/Downloads/Personal_Portfolio_Website_Database_Connected/backend
   (Adjust the path to where you extracted this ZIP.)
4. Install dependencies:
   npm install
5. Start the website:
   npm start
6. Open this address in your browser:
   http://localhost:3000

How database saving works
-------------------------
- Open the Contact section.
- Enter name, email, and message.
- Click "Send Message".
- The browser sends the form data to POST /api/contact.
- Express validates the fields and saves the message to SQLite.
- The page shows a success message after the database confirms saving.

Useful API routes
-----------------
GET  /api/health  — confirms the server is running
POST /api/contact — saves a contact message to SQLite

Database file
-------------
backend/portfolio.db is created automatically when the server starts.
Back up this file if you want to keep the submitted messages.

Privacy/security
----------------
The public API does not expose saved messages. An optional protected
/admin-style route exists at GET /api/messages and is disabled by default.
Do not publish private messages or enable that endpoint on a public server
without setting a strong secret token and adding further production security.

Important
---------
Opening index.html directly as a file will not connect to the database.
Start the backend and visit http://localhost:3000 instead.
