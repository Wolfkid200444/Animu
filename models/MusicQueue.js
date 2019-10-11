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
  skipVotes: [String],
  loop: {
    type: String,
    default: 'disabled',
  }, // 'disabled', 'single', 'queue'
});

model('MusicQueue', musicQueueSchema);
