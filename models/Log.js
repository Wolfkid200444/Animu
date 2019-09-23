const { Schema, model } = require('mongoose');

const logSchema = new Schema({
  guildID: String,
  event: String,
  dateTime: {
    type: Date,
    default: Date.now,
  },
  data: Schema.Types.Mixed,
});

model('Log', logSchema);
