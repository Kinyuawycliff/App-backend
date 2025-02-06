// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const sequelize = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const workRoutes = require('./routes/workRoutes');
// const updateRoutes = require('./routes/updateRoute')
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());

// // Increase body size limit for JSON requests
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



// app.use('/api/auth', authRoutes);
// app.use('/api/works', workRoutes);
// app.use('/api', updateRoutes);

// sequelize.sync()
//     .then(() => {
//         console.log('Database connected successfully');
//         app.listen(PORT, () => {
//             console.log(`Server is running on http://localhost:${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });




require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);
const authRoutes = require('./routes/authRoutes');
const workRoutes = require('./routes/workRoutes');
const updateRoutes = require('./routes/updateRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/works', workRoutes);
app.use('/api', updateRoutes);

// Health check route to verify database connection
app.get('/api/db-version', async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).json({ dbVersion: version });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

app.get('/', (req, res) =>{
  res.send("App Backend")
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
