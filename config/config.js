require('dotenv').config();
const _ = require('underscore');

// Load app configuration

const envBaseUrl = `./env/${process.env.NODE_ENV}.json` || {};

module.exports =
    _.extend(
      require('./env/all.js'),
      require(envBaseUrl)
    );
