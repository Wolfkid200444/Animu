const { Schema, model } = require('mongoose');

const musicQueueSchema = new Schema({
  guildID: String,
  songs: [
    {
      title: String,
      url: String,
    },
  ],
  volume: {
    type: Number,
    default: 50,
    min: 1,
    max: 100,
  },
  skipVotes: {
    type: Number,
    default: 0,
  },
});

model('MusicQueue', musicQueueSchema);
