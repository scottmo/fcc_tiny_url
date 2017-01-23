'use strict';

const express = require('express');
const path = require('path');
const mongo = require('mongodb');
const routes = require('./app/routes');
const app = express();

// load mongolab env vars
require('dotenv').config({
  silent: true
});

const mongouri = process.env.MLAB_URI || 'mongodb://localhost:27017/xsurl';
const port = process.env.PORT || 8080;

mongo.MongoClient.connect(mongouri, function(err, db) {

  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB on port 27017.');
  }

  // The format follows as, alias to use for real path, also allows permission to such path.

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  db.createCollection("sites", {
    capped: true,
    size: 5242880,
    max: 5000
  });

  routes(app, db);

  app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
  });

});