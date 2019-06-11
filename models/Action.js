const { Schema, model } = require('mongoose');

const actionSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  requireConsent: Boolean,
  urls: [String]
});

model('Action', actionSchema);
