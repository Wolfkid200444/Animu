const { Schema, model } = require('mongoose');

const bankAccountSchema = new Schema({
  memberID: {
    type: String,
    unique: true,
  },
  deposits: [
    {
      daysLeft: Number, // Number of days till the period of this deposit ends
      coins: Number, // Total number of coins TO GIVE to the user
    },
  ],
});

// Statics
bankAccountSchema.statics.createAccount = async function(memberID) {
  const bankAccount = await this.findOne({ memberID }).exec();

  if (bankAccount) return { res: 'already_exists', bankAccount ***REMOVED***

  return {
    res: 'created',
    bankAccount: await new this({
      memberID,
      deposits: [],
    }).save(),
  ***REMOVED***
***REMOVED***

// Schema Methods
bankAccountSchema.methods.addDeposit = async function(period, coins) {
  this.deposits.push({
    daysLeft: period * 7,
    coins,
  });

  this.save();
  return true;
***REMOVED***

model('BankAccount', bankAccountSchema);
