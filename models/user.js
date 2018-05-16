const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  passwordReset: { type: String, select: false },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
