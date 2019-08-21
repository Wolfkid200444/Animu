const { Schema, model } = require('mongoose');

const selfRoleSchema = new Schema({
  guildID: String,
  messageID: String,
  emojiName: String,
  roleName: String
});

model('SelfRole', selfRoleSchema);
