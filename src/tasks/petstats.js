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
      console.log('Handling Pet Stats:', pet.memberID);
      const hunger = await pet.notFedInHour();
      const happiness = await pet.notPlayedInHour();

      const happinessRequired =
        pet.personality === 2 || pet.personality === 3
          ? 40
          : pet.personality === 1 || pet.personality === 4
          ? 60
          : 50;

      const petUnhappyHoursLimit =
        pet.personality === 2 || pet.personality === 3
          ? 20
          : pet.personality === 1 || pet.personality === 4
          ? 10
          : 15;

      if (
        pet.petUnhappyForHours + 1 >= petUnhappyHoursLimit ||
        happiness <= 0
      ) {
        await Pet.deleteOne({ memberID: pet.memberID }).exec();
        return this.client.users
          .get(pet.memberID)
          .send(`Your pet was too unhappy and thus decided to leave you... F`);
      }

      if (happiness <= happinessRequired)
        await Pet.updateOne(
          { memberID: pet.memberID },
          { $inc: { petUnhappyforHours: 1 } }
        ).exec();

      if (hunger >= 100) {
        await Pet.deleteOne({ memberID: pet.memberID }).exec();
        this.client.users
          .get(pet.memberID)
          .send(`Your pet has died from hunger.... F`);
      }

      // Pet isn't dead yet
      if (hunger > 90 || happiness < 10)
        this.client.users
          .get(pet.memberID)
          .send(
            pet.petType === 'cat'
              ? 'Meow Meoooow Meooooowwwww!!'
              : 'Bork Bork Bork Bork!!'
          );
      else if (hunger > 60 || happiness < 40)
        this.client.users
          .get(pet.memberID)
          .send(pet.petType === 'cat' ? 'Meeeeowwww!' : 'Bork Bork!');
      else if (hunger > 40 || happiness < 60)
        this.client.users
          .get(pet.memberID)
          .send(pet.petType === 'cat' ? 'Meow!' : 'Bork!');
    });
  }
***REMOVED***
