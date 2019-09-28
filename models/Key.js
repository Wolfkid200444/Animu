const { Schema, model } = require('mongoose');

const keySchema = new Schema({
  key: String,
  daysLeft: Number,
  version: String,
});

model('Key', keySchema);
