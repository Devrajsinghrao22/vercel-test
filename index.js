const express = require('express');
const app = express();

require('./db');
const PORT = 5000;
const authRoutes = require('./routes/authRoutes');

// Initialize PostgreSQL connection pool

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Api is running!');
});

app.get('/test', (req, res) => {
  res.send('test Api is running!')
})

app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})