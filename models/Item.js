const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  description: String,
  imageURL: String,
  price: Number,
  discount: {
    type: Number,
    min: 0,
    max: 100,
  },
  usable: Boolean,
  instantUse: Boolean,
  inShop: Boolean,
  purchaseMsg: String,
  properties: [String],
});

//Model Methods
itemSchema.statics.createItem = async function(
  itemName,
  description,
  price,
  discount,
  usable,
  instantUse,
  inShop,
  purchaseMsg,
  properties
) {
  const item = await this.findOne({ name: itemName }).exec();

  if (item) return { res: 'already_exists', item ***REMOVED***

  return await new this({
    name: itemName,
    description: description,
    price,
    discount,
    usable,
    instantUse,
    inShop,
    purchaseMsg,
    properties: properties.split(',').map(role => role.trim()),
  }).save();
***REMOVED***

//Schema Methods
itemSchema.methods.purchase = async function(msg, memberID) {
  const inventory = await this.model('Inventory')
    .findOne({ memberID })
    .exec();

  const price = this.price - this.price * (this.discount / 100);

  if (inventory.coins < price)
    return {
      res: 'err',
      title: 'Insufficient Coins',
      desc: "You don't have enough coins to purchase this item",
    ***REMOVED***

  //Purchasing item
  inventory.coins -= price;

  //Use item instantly
  if (this.instantUse) {
    this.roles.forEach(role => {
      if (role !== 'none') {
        //Assigning role
        const role = msg.guild.roles.find(r => r.name === role);

        msg.guild.members.get(memberID).addRole(role.id);
      }
    });

    if (this.name === 'Pet Cat' || this.name === 'Pet Dog') {
      const Pet = this.model('Pet');

      const existingPet = await Pet.findOne({ memberID }).exec();

      if (existingPet)
        return {
          res: 'err',
          title: 'Already Own a pet',
          desc:
            'You already own a pet, use `kickPet` command to kick out your current pet before you can purchase a new pet',
        ***REMOVED***

      await new Pet({
        memberID: memberID,
        petType: this.name.substr(4).toLowerCase(),
        petName: this.name.substr(4),
      }).save();

      await inventory.save();
    }

    return {
      res: 'success',
      title: 'Item Purchased',
      desc: this.purchaseMsg,
    ***REMOVED***
  } else {
    //Add item to inventory
    inventory.inventory.push(this.name);

    await inventory.save();

    return { res: 'success', title: 'Item Purchased', desc: this.purchaseMsg ***REMOVED***
  }
***REMOVED***

model('Item', itemSchema);
