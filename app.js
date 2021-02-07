const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

dotenv.config();

const DBENV = process.env.DB_CONNECT;

// connect to DB
mongoose.connect(
    DBENV, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB!'),
);

// Middleware
app.use(express.json());
// Route midleware
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(3000, () => console.log('Up and Running'));