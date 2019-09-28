const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildID: String,
  key: String,
  animuVersion: String,
  levelPerks: [
    {
      level: Number,
      badge: String,
      role: String,
      rep: Number,
    },
  ],
});

model('Guild', guildSchema);
