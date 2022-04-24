"use strict";

/**
 * Gather dependencies
 */
const express = require("express");
const fileUpload = require('express-fileupload');
const env = require('dotenv');
const path = require('path');
const cors = require('cors');

/**
 * Read from dotenv
 */
env.config();

/**
 * Enable global helpers
 */
require('./config/global');


/**
 * Initialize the application
 */
const app = express();

/**
 * Initiate the port
 */
const port = process.env.PORT || 1000;

/**
 * Initialize the database
 */
const db = require("./config/database");

/**
 * Initialize webpush
 */
const webpush = require('web-push');

/**
 * Static Path
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Use body parser and form and web push
 */

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());

/**
 * Enable cors
 */
app.use(cors());

/**
 * Enable cron
 */
const cron = require('./config/cron');



/**
 * Import all routers
 */
const apiRoutes = require('./routes/api');
const devRoutes = require('./routes/dev');


/**
 * Use All Routes
 */
app.use('/api/v1', apiRoutes);

app.use('/dev', devRoutes);

/**
 * default path
 */
app.use("*", (req, res) => {
  res.status(404).json({ message: "You might be lost!" });
});

app.use(require('./config/errorhandler'));

app.listen(port, () => {
  console.log("started server on port: " + port);
});
