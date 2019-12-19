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
      const lastFed = await pet.notFedInHour();

      if (lastFed === 23)
        this.client.users
          .get(pet.memberID)
          .send('You have 1 hour to feed your pet, or you pet **will** die');

      if (lastFed >= 24) {
        Pet.deleteOne({ memberID: pet.memberID }).exec();
        this.client.users
          .get(pet.memberID)
          .send(`You didn't feed your pet for 24 hours and thus it died`);
      }
    });
  }
***REMOVED***
