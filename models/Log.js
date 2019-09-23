const { Schema, model } = require('mongoose');

const logSchema = new Schema({
  guildID: String,
  logType: String,
  value: String,
});

model('Log', logSchema);
