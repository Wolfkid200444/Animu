const { Schema, model } = require('mongoose');

const configSchema = new Schema({
  key: {
    type: String,
    unique: true
  },
  value: Schema.Types.Mixed
});

model('Config', configSchema);
