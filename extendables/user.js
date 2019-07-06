const { Extendable } = require('klasa');
const { User, MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

//Init
const Profile = model('Profile');
const Inventory = model('Inventory');

module.exports = class extends Extendable {
  constructor(...args) {
    super(...args, {
      enabled: true,
      appliesTo: [User]
    });
  }

  /**
   * Register a user's profile
   *
   * @returns {boolean} - True if profile was register, false if profile already exists
   */
  async register() {
    const profile = await Profile.findOne({ memberID: this.id }).exec();

    if (profile) return false;

    return await Profile.register(this.id);
  }

  /**
   * Get User's profile embed
   *
   * @returns {MessageEmbed} - MessageEmbed containing profile or error
   */
  async getProfileEmbed() {
    const aldovia = this.client.guilds.get('556442896719544320');
    const profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) return this._noProfile();

    //Generating basic embed
    const profileEmbed = new MessageEmbed()
      .setThumbnail(this.displayAvatarURL({ size: 256 }))
      .addField('❯ Name', this.username, true)
      .addField('❯ ID', this.id, true)
      .addField('❯ Description', profile.description)
      .setColor(profile.profileColor);

    //Checking Aldovia Title
    let isOwner = false;

    for (const owner of this.client.owners)
      if (owner.id === this.id) isOwner = true;

    //If is owner
    if (isOwner) profileEmbed.setFooter('👑 Aldovia Admin 👑');
    //If is Senior Moderator
    else if (
      aldovia.members
        .get(profile.memberID)
        .roles.find(r => r.name === 'Senior Moderator')
    )
      profileEmbed.setFooter('🛡 Senior Moderator');
    //Else
    else {
      if (profile.activeBadge) profileEmbed.setFooter(profile.activeBadge);

      profileEmbed
        .addField(
          '❯ Reputation',
          `${profile.reputation <= 20 ? '⚠️' : ''} ${profile.reputation}%`,
          true
        )
        .addField(
          '❯ Rewards',
          `Silver: ${profile.rewards.silver} \tGold: ${
            profile.rewards.gold
          } \tPlatinum: ${profile.rewards.platinum}`,
          true
        );
    }

    //If member is married
    if (profile.marriedTo)
      profileEmbed.addField(
        '❯ Married To',
        this.client.guilds
          .find(guild => guild.members.get(profile.marriedTo) !== undefined)
          .members.get(profile.marriedTo).displayName ||
          this.client.users.get(profile.marriedTo).username ||
          '[Left Aldovia Network...]',
        true
      );

    profileEmbed.addField('❯ Favorite Anime', profile.favoriteAnime);

    return profileEmbed;
  }

  /**
   * Get Inventory Embed
   *
   * @param {boolean} [partner=false] - Whether this is partner's inventory
   * @returns {MessageEmbed} - MessageEmbed containing inventory or error
   */
  async getInventoryEmbed(partner = false) {
    const aldovia = this.client.guilds.get('556442896719544320');
    const profile = await Profile.findOne({
      memberID: this.id
    }).exec();

    if (!profile) return this._noProfile();

    if (!profile.marriedTo && partner) return;
    new MessageEmbed()
      .setTitle('Not married')
      .setDescription(
        "You can't view your partner's inventory when you have no partner... You did an Ooopsie!"
      )
      .setColor('#f44336');

    const inventory = await Inventory.findOne({
      memberID: partner ? profile.marriedTo : this.id
    }).exec();

    let inventoryStr = '';
    const inventoryItems = {***REMOVED***

    inventory.inventory.forEach(item => {
      inventoryItems[item] = inventoryItems[item] + 1 || 1;
    });

    for (var item in inventoryItems)
      inventoryStr +=
        inventoryItems[item] > 1
          ? `${item} x${inventoryItems[item]}\n`
          : `${item}\n`;

    //Checking Aldovia Title
    let isOwner = false;

    for (const owner of this.client.owners)
      if (owner.id === inventory.memberID) isOwner = true;

    if (
      isOwner ||
      aldovia.members
        .get(inventory.memberID)
        .roles.find(r => r.name === 'Senior Moderator')
    )
      return new MessageEmbed()
        .setTitle('No Inventory')
        .setDescription(
          "Senior Moderators and Server Admins can't view/use their inventory"
        )
        .setColor('#f44336');

    return new MessageEmbed()
      .setTitle(
        `${this.client.users.get(inventory.memberID).username ||
          'Unknown'}'s Inventory`
      )
      .addField('Coins', inventory.coins)
      .addField('Inventory', inventoryStr || '[Inventory is empty]')
      .setColor('#2196f3');
  }

  /**
   * Edit a profile
   *
   * @param {String} key - Key to edit
   * @param {String} value - New value for specified key
   * @returns {true} - True
   */
  async editProfile(key, value) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) profile = await Profile.register(this.id);

    await profile.edit(key, value);
    return true;
  }

  /**
   * Edit Reputation of a user
   *
   * @param {('+'|'-')} change - Add (+) or deduct (-) rep?
   * @param {number} amount - amount of rep to add/deduct
   * @returns {boolean} - True if reputation was added/deducted, False if user was banned due to low rep
   */
  async editReputation(change, amount) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) profile = await Profile.register(this.id);

    if (change === '+') return await profile.addReputation(amount);
    else {
      const res = await profile.deductReputation(amount);
      if (!res) {
        this.client.guilds
          .get('556442896719544320')
          .members.get(this.id)
          .ban({ reason: 'Reached 0% Reputation' });
      }
      return res;
    }
  }

  /**
   * Add or deduct coins of a user
   *
   * @param {('+'|'-')} change - Add (+) or deduct (-)
   * @param {number} amount - Amount of coins to add/deduct
   * @returns {true} - True
   */
  async editCoins(change, amount) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) profile = await Profile.register(this.id);

    const inventory = await Inventory.findOne({ memberID: this.id }).exec();

    if (change === '+') await inventory.addCoins(amount);
    else await inventory.deductCoins(amount);
    return true;
  }

  _noProfile(isAuthor = false) {
    return isAuthor
      ? new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Your profile doesn't exist, use `register` command to register"
          )
          .setColor('#f44336')
      : new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "The profile you're looking for doesn't exist, if it's your profile, use `register` command to register"
          )
          .setColor('#f44336');
  }
***REMOVED***
