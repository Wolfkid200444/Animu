const { Schema, model } = require('mongoose');

const partnerSchema = new Schema({
  guildID: {
    type: String,
    unique: true
  },
  channels: {
    networkServers: String
  }
});

model('Partner', partnerSchema);
