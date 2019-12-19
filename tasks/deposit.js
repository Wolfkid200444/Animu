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
      account.deposits.forEach(async deposit => {
        if (deposit.daysLeft === 1) {
          const inv = await Inventory.findOne({ memberID: account.memberID });
          console.log(inv);
          await inv.addCoins(deposit.coins);
          console.log(inv);

          // eslint-disable-next-line require-atomic-updates
          deposit = undefined;
        }
        if (deposit.daysLeft > 0) deposit.daysLeft--;
      });
      console.log(account);
      await account.save();
    });
  }
***REMOVED***
