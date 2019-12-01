//Dependencies
const { Extendable } = require('klasa');
const { User, MessageEmbed } = require('discord.js');
const { model } = require('mongoose');
const _ = require('lodash');

//Init
const Profile = model('Profile');
const Inventory = model('Inventory');
const Item = model('Item');
const Pet = model('Pet');

module.exports = class extends Extendable {
  constructor(...args) {
    super(...args, {
      enabled: true,
      appliesTo: [User],
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
   * @param {String} guildID - ID of the guild to fetch profile for
   *
   * @returns {MessageEmbed} - MessageEmbed containing profile or error
   */
  async getProfileEmbed(guildID) {
    const profile = await Profile.findOne({ memberID: this.id }).exec();
    const pet = await Pet.findOne({ memberID: this.id }).exec();

    if (!profile) return this._noProfile();

    //Generating basic embed
    const profileEmbed = new MessageEmbed()
      .setThumbnail(this.displayAvatarURL({ size: 256 }))
      .addField('❯ Name', this.username, true)
      .addField('❯ ID', this.id, true)
      .addField('❯ Description', profile.description)
      .setImage(profile.profileWallpaper)
      .setColor(profile.profileColor);

    //Checking Aldovia Title
    let isOwner = false;

    for (const owner of this.client.owners)
      if (owner.id === this.id) isOwner = true;

    //If is owner
    if (isOwner) profileEmbed.setFooter('👑 Bot Owner 👑');
    //If is 🛡 Senior Moderator
    else if (
      _.includes(this.client.settings.aldoviaSeniorMods, profile.memberID)
    )
      profileEmbed.setFooter('🛡 Bot Staff');
    //Else
    else {
      if (
        profile.badges.find(guildBadges => guildBadges.guildID === guildID) &&
        profile.badges.find(guildBadges => guildBadges.guildID === guildID)
          .activeBadge
      )
        profileEmbed.setFooter(
          profile.badges.find(guildBadges => guildBadges.guildID === guildID)
            .activeBadge
        );

      let proceedRep = true;

      const thisGuild = this.client.guilds.get(guildID);

      for (let i = 0; i < thisGuild.settings.ignoreRepRoles.length; i++) {
        const ignoreRepRole = thisGuild.settings.ignoreRepRoles[i];
        if (
          this.client.guilds
            .get(guildID)
            .members.get(this.id)
            .roles.has(ignoreRepRole)
        ) {
          proceedRep = false;
          break;
        }
      }

      if (proceedRep) {
        const repRaw = profile.reputation.find(
          reputation => reputation.guildID === guildID
        );

        if (repRaw)
          profileEmbed.addField(
            '❯ Reputation',
            `${repRaw.rep <= 20 ? '⚠️' : ''} ${repRaw.rep} 🏆`,
            true
          );
        else
          profileEmbed.addField(
            '❯ Reputation',
            'Not configured (use `setup`)',
            true
          );
      }

      let proceedLevel = true;

      if (!thisGuild.settings.enableLevels) proceedLevel = false;

      for (let i = 0; i < thisGuild.settings.ignoreLevelRoles.length; i++) {
        const ignoreLevelRole = thisGuild.settings.ignoreLevelRoles[i];
        if (
          this.client.guilds
            .get(guildID)
            .members.get(this.id)
            .roles.has(ignoreLevelRole)
        ) {
          proceedLevel = false;
          break;
        }
      }

      if (proceedLevel) {
        const levelRaw = profile.level.find(level => level.guildID === guildID);

        if (levelRaw)
          profileEmbed.addField(
            '❯ Level',
            `${levelRaw.level} (${levelRaw.exp}/${10 *
              (levelRaw.level + 1) ** 2} Exp)`,
            true
          );
        else
          profileEmbed.addField(
            '❯ Level',
            'Not configured (use `setup`)',
            true
          );
      }
    }

    //If member is married
    if (profile.marriedTo)
      if (this.client.users.has(profile.marriedTo))
        profileEmbed.addField(
          '❯ Married To',
          this.client.users.get(profile.marriedTo).username,
          true
        );
      else profileEmbed.addField('❯ Married To', '[Not found...]', true);

    profileEmbed.addField('❯ Favorite Anime', profile.favoriteAnime);

    if (pet)
      profileEmbed.addField(
        '❯ Pet',
        `${
          pet.petType === 'cat' ? '🐱' : pet.petType === 'dog' ? '🐶' : '❓'
        } ${pet.petName}`,
        true
      );

    return profileEmbed;
  }

  /**
   * Get Inventory Embed
   *
   * @param {boolean} [partner=false] - Whether this is partner's inventory
   * @returns {MessageEmbed} - MessageEmbed containing inventory or error
   */
  async getInventoryEmbed(partner = false) {
    const profile = await Profile.findOne({
      memberID: this.id,
    }).exec();

    if (!profile) return this._noProfile();

    if (!profile.marriedTo && partner)
      return new MessageEmbed()
        .setTitle('Not married')
        .setDescription(
          "You can't view your partner's inventory when you have no partner... You did an Ooopsie!"
        )
        .setColor('#f44336');

    const inventory = await Inventory.findOne({
      memberID: partner ? profile.marriedTo : this.id,
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
      _.includes(this.client.settings.aldoviaSeniorMods, profile.memberID)
    )
      return new MessageEmbed()
        .setTitle('No Inventory')
        .setDescription("🛡 Bot Staff and Owners can't view/use their inventory")
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
   * Get Profile Wallpapers Embed
   * @returns {MessageEmbed} - Message embed containing wallpapers
   */
  async getWallpapersEmbed() {
    const inventory = await Inventory.findOne({ memberID: this.id }).exec();

    if (!inventory) return this._noProfile(true);

    return new MessageEmbed({
      title: 'Profile Wallpapers',
      description:
        inventory.profileWallpapers.length === 0
          ? '[Empty]'
          : inventory.profileWallpapers.map(w => `• ${w.name}`).join('\n'),
      color: 0x2196f3,
    });
  }

  /**
   * Get Badges embed
   * @param {string} guildID - ID of Guild to get badges embed for
   * @returns {MessageEmbed} - Message embed containing badges
   */
  async getBadgesEmbed(guildID) {
    const profile = await Profile.findOne({
      memberID: this.id,
    }).exec();

    if (!profile) return this._noProfile();

    //Checking Aldovia Title
    let isOwner = false;

    for (const owner of this.client.owners)
      if (owner.id === profile.memberID) isOwner = true;

    if (
      isOwner ||
      _.includes(this.client.settings.aldoviaSeniorMods, profile.memberID)
    )
      return new MessageEmbed()
        .setTitle('No Badges')
        .setDescription("🛡 Bot Staff and Owners can't view/use their badges")
        .setColor('#f44336');

    let badgesString = '';

    if (profile.badges.find(guildBadges => guildBadges.guildID === guildID)) {
      if (
        profile.badges.find(guildBadges => guildBadges.guildID === guildID)
          .badges.length < 1
      )
        badgesString = false;
      else
        profile.badges
          .find(guildBadges => guildBadges.guildID === guildID)
          .badges.forEach(badge => (badgesString += `${badge}\n`));

      return new MessageEmbed()
        .setTitle(
          `${this.client.users.get(profile.memberID).username ||
            'Unknown'}'s Badges`
        )
        .addField(
          'Active Badge',
          profile.badges.find(guildBadges => guildBadges.guildID === guildID)
            .activeBadge || '[No active badge]'
        )
        .addField('All Badges', badgesString || '[No badges]')
        .setColor('#2196f3');
    } else {
      return new MessageEmbed({
        title: 'Badges',
        description: 'No badges found',
        color: '#2196f3',
      });
    }
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

    if (key === 'profileWallpaper') {
      const inventory = await Inventory.findOne({ memberID: this.id }).exec();

      const index = inventory.profileWallpapers.findIndex(
        w => w.name === value
      );

      if (index < 0) return;

      console.log('MODIFYING');

      inventory.profileWallpapers.map(w => (w.inUse = false));

      inventory.profileWallpapers[index].inUse = true;

      value = inventory.profileWallpapers[index].url;

      await inventory.save();
    }

    await profile.edit(key, value);
    return true;
  }

  /**
   * Edit Reputation of a user
   *
   * @param {('+'|'-')} change - Add (+) or deduct (-) rep?
   * @param {number} amount - amount of rep to add/deduct
   * @param {String} guildID - ID of guild to add/deduct rep for
   * @returns {boolean} - True if reputation was added/deducted, False if user was banned due to low rep
   */
  async editReputation(change, amount, guildID) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    //Checking Aldovia Title
    let isOwner = false;

    for (const owner of this.client.owners)
      if (owner.id === profile.memberID) isOwner = true;

    if (
      isOwner ||
      _.includes(this.client.settings.aldoviaSeniorMods, profile.memberID)
    )
      return true;

    let proceed = true;

    const thisGuild = this.client.guilds.get(guildID);

    for (let i = 0; i < thisGuild.settings.ignoreRepRoles.length; i++) {
      const ignoreRepRole = thisGuild.settings.ignoreRepRoles[i];
      if (
        this.client.guilds
          .get(guildID)
          .members.get(this.id)
          .roles.has(ignoreRepRole)
      ) {
        proceed = false;
        break;
      }
    }

    if (!proceed) return true;

    if (!profile) profile = await Profile.register(this.id);

    if (change === '+') return await profile.addReputation(amount, guildID);
    else {
      const res = await profile.deductReputation(amount, guildID);
      if (!res && this.client.guilds.get(guildID).settings.banOnLowRep) {
        this.client.guilds
          .get(guildID)
          .members.get(this.id)
          .ban({ reason: 'Reached 0 Reputation' });
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

  /**
   * Give a badge to a member
   *
   * @param {string} badgeName - Badge to give
   * @param {string} guildID - ID of Guild for which this badge is being given
   * @returns {boolean} - True if badge was given & false if badge is already given
   */
  async giveBadge(badgeName, guildID) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) profile = await Profile.register(this.id);

    if (profile.badges.find(guildBadges => guildBadges.guildID === guildID)) {
      if (
        _.includes(
          profile.badges.find(guildBadges => guildBadges.guildID === guildID)
            .badges,
          badgeName
        )
      )
        return false;
      else
        profile.badges
          .find(guildBadges => guildBadges.guildID === guildID)
          .badges.push(badgeName);

      await profile.save();
    } else {
      profile.badges.push({
        guildID: guildID,
        badges: [badgeName],
      });
      await profile.save();
    }

    return true;
  }

  /**
   * Add Exp to a user's profile
   *
   * @param {Number} expToAdd - Amount of Exp to add
   * @param {String} guildID - ID of guild to add exp for
   * @returns {Promise<Array<Role>|False>} - Array if a role is to be added, False otherwise
   */
  async addExp(expToAdd, guildID) {
    return new Promise(resolve => {
      Profile.findOne({ memberID: this.id }).then(async profile => {
        if (!profile) profile = await Profile.register(this.id);

        const res = await profile.addExp(
          expToAdd,
          guildID,
          this.client.guilds.get(guildID).settings.startingRep
        );
        resolve(res);
      });
    });
  }

  /**
   * Set an active badge
   *
   * @param {string} badgeName - Badge to set active
   * @param {string} guildID - ID of Guild for which this badge is being set as active
   * @returns {boolean} - True if badge was given & false if badge is already given
   */
  async setActiveBadge(badgeName, guildID) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) return this._noProfile(true);

    if (!profile.badges.find(guildBadges => guildBadges.guildID === guildID))
      return false;

    if (
      _.includes(
        profile.badges.find(guildBadges => guildBadges.guildID === guildID)
          .badges,
        badgeName
      )
    ) {
      if (
        profile.badges.find(guildBadges => guildBadges.guildID === guildID)
          .activeBadge
      )
        profile.badges
          .find(guildBadges => guildBadges.guildID === guildID)
          .badges.push(
            profile.badges.find(guildBadges => guildBadges.guildID === guildID)
              .activeBadge
          );

      profile.badges.find(
        guildBadges => guildBadges.guildID === guildID
      ).activeBadge = badgeName;

      profile.badges.find(
        guildBadges => guildBadges.guildID === guildID
      ).badges = profile.badges
        .find(guildBadges => guildBadges.guildID === guildID)
        .badges.filter(badge => badge !== badgeName);

      await profile.save();
    } else {
      return false;
    }

    return true;
  }

  /**
   * Use an item from inventory
   * @param {String} itemName - Name of item to use
   * @returns {MessageEmbed} - Embed to show to user
   */
  async useItem(itemName) {
    const inventory = await Inventory.findOne({ memberID: this.id }).exec();

    if (!inventory) return this._noProfile(true);

    const index = inventory.inventory.indexOf(itemName);

    if (index < 0)
      return new MessageEmbed()
        .setTitle('Item not found')
        .setDescription(
          "The item you're trying to use doesn't exist in your inventory"
        )
        .setColor('#f44336');

    const item = await Item.findOne({ name: itemName }).exec();

    if (!item.usable)
      return new MessageEmbed()
        .setTitle("Item Can't be used")
        .setDescription("The item you're trying to use can't be used manually")
        .setColor('#f44336');

    inventory.inventory.splice(index, 1);

    let embed;

    // Custom items
    if (item.name === 'Profile Wallpapers Box') {
      const wallpaper = _.sample(profileWallpapers);
      inventory.profileWallpapers.push(
        Object.assign(wallpaper, { inUse: false })
      );
      embed = new MessageEmbed({
        title: 'Opened Profile Wallpapers Box!',
        description: `You got.... **${wallpaper.name}**`,
        color: 0x2196f3,
      }).setImage(wallpaper.url);
    }

    await inventory.save();

    return embed;
  }

  /**
   * Setup profile for a guild
   * @param {String} guildID - ID of guild to setup this profile for
   * @returns {MessageEmbed} - Embed containing details
   */
  async setupProfile(guildID) {
    const profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) return this._noProfile(true);

    if (!profile.reputation.find(rep => rep.guildID === guildID))
      profile.reputation.push({
        guildID: guildID,
        rep: this.client.guilds.get(guildID).settings.startingRep,
      });

    if (!profile.level.find(level => level.guildID === guildID))
      profile.level.push({
        guildID: guildID,
        level: 1,
        exp: 0,
      });

    await profile.save();

    return new MessageEmbed({
      title: 'Setup complete',
      description: 'Your profile is configured for this server',
      color: '#2196f3',
    });
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

const profileWallpapers = [
  {
    name: 'Hatsune Miku 1',
    url:
      'https://images.wallpaperscraft.com/image/hatsune_miku_girl_cute_posture_look_25061_2560x1080.jpg',
  },
  {
    name: 'Saitama 1',
    url:
      'https://images.wallpaperscraft.com/image/one_punch_man_saitama_character_113257_2560x1080.jpg',
  },
  {
    name: 'Lelouch 1',
    url:
      'https://images.wallpaperscraft.com/image/lelouch_lamperouge_code_geass_zero_102069_2560x1080.jpg',
  },
  {
    name: 'Naruto 1',
    url:
      'https://images.wallpaperscraft.com/image/naruto_naruto_shippuuden_uzumaki_naruto_112160_2560x1080.jpg',
  },
  {
    name: 'Naruto 2',
    url:
      'https://images.wallpaperscraft.com/image/naruto_naruto_shippuden_sasuke_uchiha_112104_2560x1080.jpg',
  },
  {
    name: 'Naruto 3',
    url:
      'https://images.wallpaperscraft.com/image/boy_naruto_blond_drop_stern_look_24237_2560x1080.jpg',
  },
  {
    name: 'Goku 1',
    url:
      'https://images.wallpaperscraft.com/image/dragon_ball_z_goku_super_saiyan_113565_2560x1080.jpg',
  },
  {
    name: 'Itachi 1',
    url:
      'https://images.wallpaperscraft.com/image/naruto_itachi_uchiha_nukenin_112126_2560x1080.jpg',
  },
  {
    name: 'Sakura 1',
    url:
      'https://images.wallpaperscraft.com/image/sakura_naruto_face_art_104826_2560x1080.jpg',
  },
  {
    name: 'Toshiro 1',
    url:
      'https://images.wallpaperscraft.com/image/toshiro_hitsugaya_bleach_shinigami_art_105451_2560x1080.jpg',
  },
  {
    name: 'Natsu 1',
    url:
      'https://images.wallpaperscraft.com/image/fairy_tail_man_fire_hand_look_angry_102300_2560x1080.jpg',
  },
  {
    name: 'Alucard 1',
    url:
      'https://images.wallpaperscraft.com/image/hellsing_ultimate_alucard_vampire_108279_2560x1080.jpg',
  },
  {
    name: 'Holo 1',
    url:
      'https://images.wallpaperscraft.com/image/spice_and_wolf_holo_girl_fox_tail_102339_2560x1080.jpg',
  },
  {
    name: 'Mikasa 1',
    url:
      'https://images.wallpaperscraft.com/image/shingeki_no_kyojin_mikasa_ackerman_art_girl_97530_2560x1080.jpg',
  },
];
