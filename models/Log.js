const { Schema, model } = require('mongoose');

const logSchema = new Schema({
  guildID: String,
  event: String,
  dateTime: {
    type: Date,
    default: Date.now,
  },
  data: Schema.Types.Mixed,
  expire_at: { type: Date, default: Date.now(), expires: 60 * 60 * 24 * 30 },
});

model('Log', logSchema);
