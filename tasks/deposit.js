const { Task } = require('klasa');
const { botEnv } = require('../config/keys');
const mongoose = require('mongoose');

//Init
const BankAccount = mongoose.model('BankAccount');
const Inventory = mongoose.model('Inventory');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const bankaccounts = await BankAccount.find({}).exec();

    bankaccounts.forEach(async account => {
      console.log(account);
      account.deposits.forEach(async (deposit, i) => {
        if (deposit.daysLeft > 0) deposit.daysLeft--;
        if (deposit.daysLeft === 0) {
          const inv = await Inventory.findOne({ memberID: account.memberID });
          console.log(inv);
          await inv.addCoins(deposit.coins);
          console.log(inv);

          account.deposits.splice(i, 1);
        }
      });
      console.log(account);
      await account.save();
    });
  }
***REMOVED***
