require("dotenv").config();
const logger = require('morgan');
const express = require("express");
const app = express();

module.exports = {
  init(){
    app.use(logger('dev'));
  }
};