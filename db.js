
const mongoose = require('mongoose');
const debug = require('debug')('app');

// connection
module.exports = mongoose.connect('mongodb://localhost/StudentMS')
 .then(() => debug("Connected successully to StudentMs"))
 .catch((err) => debug("Connection Failure", err))