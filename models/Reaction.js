const { Schema, model } = require('mongoose');

const reactionSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  urls: [String]
});

model('Reaction', reactionSchema);
