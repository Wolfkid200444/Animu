const { Task } = require('klasa');
const { botEnv } = require('../config/keys');
const mongoose = require('mongoose');

//Init
const Pet = mongoose.model('Pet');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const pets = await Pet.find({}).exec();

    pets.forEach(async pet => {
      const hunger = await pet.notFedInHour();

      if (hunger >= 100) {
        Pet.deleteOne({ memberID: pet.memberID }).exec();
        this.client.users
          .get(pet.memberID)
          .send(`Your pet has died from hunger.... F`);
      }
    });
  }
***REMOVED***
