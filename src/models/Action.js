const { Schema, model } = require('mongoose');

const actionSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  pastTense: String,
  requireConsent: Boolean,
  urls: [String]
});

model('Action', actionSchema);
