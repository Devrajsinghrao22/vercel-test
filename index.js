const express = require('express');
const app = express();
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Ensure you have a .env file for your environment variables

const authRoutes = require('./routes/authRoutes');

const PORT = 5000;
// Initialize PostgreSQL connection pool

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})

module.exports = app;
