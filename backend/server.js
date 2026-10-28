const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..')));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'sqlite', message: 'Portfolio API is running.' });
});

app.post('/api/contact', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return res.status(400).json({ error: 'One or more fields exceed the allowed length.' });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  db.run(
    'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    function (err) {
      if (err) {
        console.error('Database insert failed:', err.message);
        return res.status(500).json({ error: 'Could not save your message. Please try again.' });
      }
      return res.status(201).json({
        success: true,
        message: 'Your message has been saved successfully.',
        id: this.lastID
      });
    }
  );
});

// Only the local owner should inspect messages. This endpoint is disabled by default.
// Set ENABLE_ADMIN_API=true and ADMIN_TOKEN to enable it, then use Authorization: Bearer <token>.
app.get('/api/messages', (req, res) => {
  if (process.env.ENABLE_ADMIN_API !== 'true' || !process.env.ADMIN_TOKEN) {
    return res.status(404).json({ error: 'Not found.' });
  }
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  db.all(
    'SELECT id, name, email, message, created_at FROM contact_messages ORDER BY id DESC LIMIT 100',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Could not load messages.' });
      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Portfolio website running at http://localhost:${PORT}`);
  console.log(`SQLite database: ${dbPath}`);
});
