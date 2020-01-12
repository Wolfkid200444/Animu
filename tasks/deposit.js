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
      console.log('Deposit Account (Before)', account);
      const inv = await Inventory.findOne({ memberID: account.memberID });

      account.deposits.forEach((deposit, i) => {
        if (deposit.daysLeft > 0) deposit.daysLeft--;
        if (deposit.daysLeft === 0) {
          inv.addCoins(deposit.coins);

          account.deposits.splice(i, 1);
        }
      });
      console.log('Deposit Account (After)', account);
      await account.save();
    });
  }
***REMOVED***
