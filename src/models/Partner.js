const { Schema, model } = require('mongoose');

const partnerSchema = new Schema({
  guildID: {
    type: String,
    unique: true
  },
  description: String,
  networkServersChannelID: String,
  inviteLink: String
});

model('Partner', partnerSchema);
