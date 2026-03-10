'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
