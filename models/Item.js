const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  description: String,
  price: Number,
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  roles: [String],
  misc: [String],
  usable: Boolean,
  instantUse: Boolean,
  purchaseMsg: String,
  useMsg: String
});

//Model Methods
itemSchema.statics.createItem = async function(
  itemName,
  description,
  price,
  discount,
  roles,
  misc,
  usable,
  instantUse,
  purchaseMsg,
  useMsg
) {
  const item = await this.findOne({ name: itemName }).exec();

  if (item) return { res: 'already_exists', item ***REMOVED***

  return await new this({
    name: itemName,
    description: description,
    price,
    discount,
    roles: roles.split(',').map(role => role.trim()),
    misc: misc.split(',').map(misce => misce.trim()),
    usable,
    instantUse,
    purchaseMsg,
    useMsg
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
      desc: "You don't have enough coins to purchase this item"
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

    return { res: 'success', title: 'Item Purchased', desc: this.useMsg ***REMOVED***
  } else {
    //Add item to inventory
    inventory.inventory.push(this.name);

    await inventory.save();

    return { res: 'success', title: 'Item Purchased', desc: this.purchaseMsg ***REMOVED***
  }
***REMOVED***

model('Item', itemSchema);
