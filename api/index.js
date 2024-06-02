const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Ensure you have a .env file for your environment variables

// const authRoutes = require('./routes/authRoutes');

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: 'default',
  host: 'ep-winter-cherry-a4br1fdq-pooler.us-east-1.aws.neon.tech',
  database: 'verceldb',
  password: 'grQLB12IFkjw',
  port: '5432',
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = 'SELECT * FROM public.users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, userName: user.username },
      process.env.SECRET_KEY || 'secretKey',
      { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    const existingEmail = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUserName = await pool.query('SELECT * FROM public.users WHERE username = $1', [username]);
    if (existingUserName.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO public.users (name, username, password, email) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [name, username, hashedPassword, email]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;
