const { Task } = require('klasa');
const mongoose = require('mongoose');

//Init
const Pet = mongoose.model('Pet');

module.exports = class extends Task {
  async run() {
    const pets = await Pet.find({}).exec();

    pets.forEach(async pet => {
      const lastFed = await pet.notFedInHour();

      if (lastFed >= 24) {
        Pet.deleteOne({ memberID: pet.memberID }).exec();
        this.client.users
          .get(pet.memberID)
          .send(`You didn't feed your pet for 24 hours and thus it died`);
      }
    });
  }
***REMOVED***
