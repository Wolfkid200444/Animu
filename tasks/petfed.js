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
      const petMaxLimit =
        pet.personality === 1 || pet.personality === 3
          ? 30
          : pet.personality === 2 || pet.personality === 4
          ? 18
          : 24;

      if (lastFed >= petMaxLimit) {
        Pet.deleteOne({ memberID: pet.memberID }).exec();
        this.client.users
          .get(pet.memberID)
          .send(
            `Your pet has died as you didn't feed them for last ${lastFed} hours`
          );
      }
    });
  }
***REMOVED***
