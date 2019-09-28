const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildID: String,
  key: String,
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
