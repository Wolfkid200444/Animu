const { Schema, model } = require('mongoose');

const actionSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  doneAction: String,
  continuosAction: String,
  requireConsent: Boolean,
  urls: [String]
});

model('Action', actionSchema);
