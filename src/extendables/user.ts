//Dependencies
import { Extendable, ExtendableStore } from 'klasa';
import { User, MessageEmbed } from 'discord.js';
import { model } from 'mongoose';
import _ from 'lodash';
import redis from 'redis';
import bluebird from 'bluebird';
import { numberWithCommas } from '../util/util';
import { IProfileModel, IProfile } from '../models/Profile';
import { IPetModel } from '../models/Pet';
import { IInventoryModel } from '../models/Inventory';
import { IItemModel } from '../models/Item';
import { IGuildModel } from '../models/Guild';
import { IBankAccountModel } from '../models/BankAccount';

//Init
const Profile: IProfileModel = <IProfileModel>model('Profile');
const Inventory: IInventoryModel = <IInventoryModel>model('Inventory');
const Item: IItemModel = <IItemModel>model('Item');
const Pet: IPetModel = <IPetModel>model('Pet');
const Guild: IGuildModel = <IGuildModel>model('Guild');
const BankAccount: IBankAccountModel = <IBankAccountModel>model('BankAccount');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

module.exports = class extends Extendable {
  constructor(store: ExtendableStore, file: string[], dir: string) {
    super(store, file, dir, {
      enabled: true,
      appliesTo: [User],
    });
  }

  /**
   * Register a user's profile
   *
   * @returns False if profile already exists or Profile if it doesn't exist
   */
  async register(this: User): Promise<IProfile | false> {
    const profile = await Profile.findOne({ memberID: this.id }).exec();

    if (profile) return false;

    return await Profile.register(this.id);
  }

  /**
   * Get User's profile embed
   *
   * @param guildID - ID of the guild to fetch profile for
   *
   * @returns The MessageEmbed containing profile or error
   */
  async getProfileEmbed(this: User, guildID) {
    const profile = await Profile.findOne({ memberID: this.id }).exec();
    const pet = await Pet.findOne({ memberID: this.id }).exec();

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
    if (isOwner) profileEmbed.setFooter('👑 Bot Owner 👑');
    //If is 🛡 Senior Moderator
    else if (
      _.includes(this.client.settings.get('animuStaff'), profile.memberID)
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

      for (
        let i = 0;
        i < thisGuild.settings.get('ignoreRepRoles').length;
        i++
      ) {
        const ignoreRepRole = thisGuild.settings.get('ignoreRepRoles')[i];
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

      if (!thisGuild.settings.get('enableLevels')) proceedLevel = false;

      if (
        !_.includes(
          ['lite', 'plus', 'pro'],
          await redisClient.hgetAsync('guild_tiers', guildID)
        )
      )
        proceedLevel = false;

      for (
        let i = 0;
        i < thisGuild.settings.get('ignoreLevelRoles').length;
        i++
      ) {
        const ignoreLevelRole = thisGuild.settings.get('ignoreLevelRoles')[i];
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

    if (profile.profileWallpaper) {
      const wallpaper = await Item.findOne({ name: profile.profileWallpaper });

      profileEmbed.setImage(wallpaper.imageURL);
    }

    return profileEmbed;
  }

  /**
   * Get Inventory Embed
   *
   * @param partner - Whether this is partner's inventory or not
   * @returns The MessageEmbed containing inventory or error
   */
  async getInventoryEmbed(this: User, partner = false) {
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
    const inventoryItems = {};

    inventory.inventory.forEach(item => {
      inventoryItems[item] = inventoryItems[item] + 1 || 1;
    });

    for (var item in inventoryItems)
      inventoryStr +=
        inventoryItems[item] > 1
          ? `${item} x${inventoryItems[item]}\n`
          : `${item}\n`;

    return new MessageEmbed()
      .setTitle(
        `${this.client.users.get(inventory.memberID).username ||
          'Unknown'}'s Inventory`
      )
      .addField('Coins', numberWithCommas(inventory.coins))
      .addField('Inventory', inventoryStr || '[Inventory is empty]')
      .setColor('#2196f3');
  }

  /**
   * Get Badges embed
   *
   * @param guildID - ID of Guild to get badges embed for
   * @returns The Message embed containing badges
   */
  async getBadgesEmbed(this: User, guildID) {
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
      _.includes(this.client.settings.get('animuStaff'), profile.memberID)
    )
      return new MessageEmbed()
        .setTitle('No Badges')
        .setDescription("🛡 Bot Staff and Owners can't view/use their badges")
        .setColor('#f44336');

    let badgesString = '';

    if (profile.badges.find(guildBadges => guildBadges.guildID === guildID)) {
      if (
        profile.badges.find(guildBadges => guildBadges.guildID === guildID)
          .badges.length >= 1
      )
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
   * @param key - Key to edit
   * @param value - New value for specified key
   * @returns True, yup, just a smol little true
   */
  async editProfile(this: User, key, value) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) profile = await Profile.register(this.id);

    if (key === 'profileWallpaper') {
      const inventory = await Inventory.findOne({ memberID: this.id }).exec();
      const item = await Item.findOne({
        name: value,
        properties: 'profile_wallpaper',
      });

      if (!item) return false;

      const res = await inventory.takeItem(value);

      if (!res) return false;

      if (profile.profileWallpaper)
        await inventory.giveItem(profile.profileWallpaper);
    }

    await profile.edit(key, value);
    return true;
  }

  /**
   * Edit Reputation of a user
   *
   * @param change - Add (+) or deduct (-) rep?
   * @param amount - amount of rep to add/deduct
   * @param guildID - ID of guild to add/deduct rep for
   * @returns True if reputation was added/deducted, False if user was banned due to low rep
   */
  async editReputation(this: User, change, amount, guildID) {
    let profile = await Profile.findOne({ memberID: this.id }).exec();

    //Checking Aldovia Title
    let isOwner = false;

    for (const owner of this.client.owners)
      if (owner.id === profile.memberID) isOwner = true;

    if (
      isOwner ||
      _.includes(this.client.settings.get('animuStaff'), profile.memberID)
    )
      return true;

    let proceed = true;

    const thisGuild = this.client.guilds.get(guildID);

    for (let i = 0; i < thisGuild.settings.get('ignoreRepRoles').length; i++) {
      const ignoreRepRole = thisGuild.settings.get('ignoreRepRoles')[i];
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
      if (!res && this.client.guilds.get(guildID).settings.get('banOnLowRep')) {
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
   * @param change - Add (+) or deduct (-)
   * @param amount - Amount of coins to add/deduct
   * @returns True
   */
  async editCoins(this: User, change, amount) {
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
   * @param badgeName - Badge to give
   * @param guildID - ID of Guild for which this badge is being given
   * @returns True if badge was given & false if badge is already given
   */
  async giveBadge(this: User, badgeName, guildID) {
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
   * @param expToAdd - Amount of Exp to add
   * @param guildID - ID of guild to add exp for
   * @returns An Array of levels if a role is to be added, otherwise an empty array
   */
  async addExp(this: User, expToAdd, guildID) {
    return new Promise(resolve => {
      Profile.findOne({ memberID: this.id }).then(async profile => {
        if (!profile) profile = await Profile.register(this.id);

        const res = await profile.addExp(
          expToAdd,
          guildID,
          this.client.guilds.get(guildID).settings.get('startingRep')
        );
        resolve(res);
      });
    });
  }

  /**
   * Set an active badge
   *
   * @param badgeName - Badge to set active
   * @param guildID - ID of Guild for which this badge is being set as active
   * @returns True if badge was given & false if badge is already given
   */
  async setActiveBadge(this: User, badgeName, guildID) {
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
   *
   * @param itemName - Name of item to use
   * @param guildID - ID of the guild
   * @returns An Embed to show to user
   */
  async useItem(this: User, itemName, guildID) {
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
      const wallpapers = await Item.find({
        $and: [
          { properties: 'profile_wallpaper' },
          { properties: { $ne: 'legendary_wallpaper' } },
        ],
      });
      const wallpaper = _.sample(wallpapers);

      await inventory.giveItem(wallpaper.name);

      embed = new MessageEmbed({
        title: 'Opened Profile Wallpapers Box!',
        description: `You got.... **${wallpaper.name}**`,
        color: 0x2196f3,
      }).setImage(wallpaper.imageURL);
    } else if (item.name === 'Golden Profile Wallpapers Box') {
      const wallpapers = await Item.find({
        properties: { $all: ['profile_wallpaper', 'legendary_wallpaper'] },
      });
      const wallpaper = _.sample(wallpapers);

      await inventory.giveItem(wallpaper.name);

      embed = new MessageEmbed({
        title: 'Opened Golden Profile Wallpapers Box!',
        description: `You got.... **${wallpaper.name}**`,
        color: 0x2196f3,
      }).setImage(wallpaper.imageURL);
    } else if (
      item.name === 'Small Exp Bottle' ||
      item.name === 'Medium Exp Bottle' ||
      item.name === 'Large Exp Bottle'
    ) {
      if (!this.client.guilds.get(guildID).settings.get('allowExpBottles'))
        return new MessageEmbed({
          title: "Can't use",
          description: "This guild doesn't allow exp bottles",
          color: 0xf44336,
        });

      const ownerInventory = await Inventory.findOne({
        memberID: this.client.guilds.get(guildID).ownerID,
      }).exec();
      const guild = await Guild.findOne({
        guildID: guildID,
      }).exec();

      let expToAdd;
      let returnCoins;

      if (item.name === 'Small Exp Bottle') {
        expToAdd =
          100 * this.client.guilds.get(guildID).settings.get('expRate');
        returnCoins = 25;
      } else if (item.name === 'Medium Exp Bottle') {
        expToAdd =
          300 * this.client.guilds.get(guildID).settings.get('expRate');
        returnCoins = 75;
      } else {
        expToAdd =
          500 * this.client.guilds.get(guildID).settings.get('expRate');
        returnCoins = 125;
      }

      if (ownerInventory) ownerInventory.addCoins(returnCoins);

      const levelUps = await this.addExp(expToAdd, guildID);

      //If member actually levelled up
      if (levelUps.length) {
        levelUps.forEach(level => {
          this.client.users
            .get(this.id)
            .send(
              `Congrats, you just levelled up and reached Level ${level} in ${
                this.client.guilds.get(guildID).name
              } 🎉`
            );

          const index = guild.levelPerks.findIndex(l => l.level === level);
          console.log('Index of Guild:', index);
          if (index < 0) return true;

          //Assign reward(s)
          if (guild.levelPerks[index]) {
            console.log('Perks:', guild.levelPerks[index]);

            try {
              if (guild.levelPerks[index].badge)
                this.giveBadge(guild.levelPerks[index].badge, guildID);
              if (guild.levelPerks[index].role) {
                const role = this.client.guilds
                  .get(guildID)
                  .roles.find(r => r.name === guild.levelPerks[index].role);

                this.client.guilds
                  .get(guildID)
                  .members.get(this.id)
                  .roles.add(role);
              }

              if (guild.levelPerks[index].rep)
                this.editReputation('+', guild.levelPerks[index].rep, guildID);
            } catch (e) {
              console.log('An error occured while handling Level up perks:', e);
            }
          }
        });
      }

      embed = new MessageEmbed({
        title: 'Used Exp Bottle',
        description: `You got ${expToAdd} Exp`,
        color: 0x2196f3,
      });
    } else if (_.includes(item.properties, 'animu_subscription')) {
      if (this.client.guilds.get(guildID).ownerID !== this.id)
        return new MessageEmbed({
          title: "Can't use it here!",
          description: 'You can only use this item in servers you own',
          color: 0xf44336,
        });

      const guild = await Guild.findOne({ guildID: guildID }).exec();

      if (guild.premiumDaysLeft < 0)
        return new MessageEmbed({
          title: 'Ooops!',
          description:
            'You have Animu subscription for ∞ days, thus this item is of no use in this guild',
          color: 0xf44336,
        });

      if (_.includes(item.properties, 'animu_lite')) {
        if (guild.tier == 'plus' || guild.tier == 'pro')
          return new MessageEmbed({
            title: "Can't Use!",
            description:
              "Your current Animu subscription is incompatible with the item you're tyring to use, thus you can only use this item when your current subscription ends",
            color: 0xf44336,
          });

        const daysToGive = _.includes(item.properties, '7_days')
          ? 7
          : _.includes(item.properties, '1_month')
          ? 30
          : _.includes(item.properties, '3_months')
          ? 90
          : _.includes(item.properties, '6_months')
          ? 180
          : 365;

        guild.tier = 'lite';

        if (!guild.premiumDaysLeft) guild.premiumDaysLeft = daysToGive;
        else guild.premiumDaysLeft += daysToGive;

        await guild.save();

        await redisClient.hsetAsync('guild_tiers', guild.guildID, 'lite');

        embed = new MessageEmbed({
          title: 'Animu Lite',
          description: `You've got Animu Lite subscription!`,
          color: 0x2196f3,
        });
      } else if (_.includes(item.properties, 'animu_plus')) {
        if (guild.tier == 'lite' || guild.tier == 'pro')
          return new MessageEmbed({
            title: "Can't Use!",
            description:
              "Your current Animu subscription is incompatible with the item you're tyring to use, thus you can only use this item when your current subscription ends",
            color: 0xf44336,
          });

        const daysToGive = _.includes(item.properties, '7_days')
          ? 7
          : _.includes(item.properties, '1_month')
          ? 30
          : _.includes(item.properties, '3_months')
          ? 90
          : _.includes(item.properties, '6_months')
          ? 180
          : 365;

        guild.tier = 'plus';

        if (!guild.premiumDaysLeft) guild.premiumDaysLeft = daysToGive;
        else guild.premiumDaysLeft += daysToGive;

        await guild.save();

        await redisClient.hsetAsync('guild_tiers', guild.guildID, 'plus');

        embed = new MessageEmbed({
          title: 'Animu Plus',
          description: `You've got Animu Plus subscription!`,
          color: 0x2196f3,
        });
      } else if (_.includes(item.properties, 'animu_pro')) {
        if (guild.tier == 'lite' || guild.tier == 'plus')
          return new MessageEmbed({
            title: "Can't Use!",
            description:
              "Your current Animu subscription is incompatible with the item you're tyring to use, thus you can only use this item when your current subscription ends",
            color: 0xf44336,
          });

        const daysToGive = _.includes(item.properties, '7_days')
          ? 7
          : _.includes(item.properties, '1_month')
          ? 30
          : _.includes(item.properties, '3_months')
          ? 90
          : _.includes(item.properties, '6_months')
          ? 180
          : 365;

        guild.tier = 'pro';

        if (!guild.premiumDaysLeft) guild.premiumDaysLeft = daysToGive;
        else guild.premiumDaysLeft += daysToGive;

        await guild.save();

        await redisClient.hsetAsync('guild_tiers', guild.guildID, 'pro');

        embed = new MessageEmbed({
          title: 'Animu Pro',
          description: `You've got Animu Pro subscription!`,
          color: 0x2196f3,
        });
      }
    } else if (item.name === 'Cat Food') {
      const pet = await Pet.findOne({ memberID: this.id }).exec();

      if (!pet || pet.petType !== 'cat')
        return new MessageEmbed({
          title: "You don't have a cat to feed...",
          description: 'To purchase a cat, use `-purchase Pet Cat`',
          color: 0x2196f3,
        });

      await pet.petFed();
      await pet.petHappy(20);

      embed = new MessageEmbed({
        title: 'Fed Pet',
        description: `Successfully fed pet`,
        color: 0x2196f3,
      });
    } else if (item.name === 'Dog Food') {
      const pet = await Pet.findOne({ memberID: this.id }).exec();

      if (!pet || pet.petType !== 'dog')
        return new MessageEmbed({
          title: "You don't have a dog to feed...",
          description: 'To purchase a dog, use `-purchase Pet Dog`',
          color: 0x2196f3,
        });

      await pet.petFed();
      await pet.petHappy(20);

      embed = new MessageEmbed({
        title: 'Fed Pet',
        description: `Successfully fed pet`,
        color: 0x2196f3,
      });
    } else if (_.includes(item.properties, 'pet_coupon')) {
      const existingPet = await Pet.findOne({ memberID: this.id }).exec();

      if (existingPet)
        return new MessageEmbed({
          title: 'Already Own a pet',
          description:
            'You already own a pet, use `kickPet` command to kick out your current pet before you can get a new pet',
        });

      await new Pet({
        memberID: this.id,
        petType: item.name === 'Pet Cat - Coupon' ? 'cat' : 'dog',
        petName: item.name === 'Pet Cat - Coupon' ? 'Cat' : 'Dog',
      }).save();

      embed = new MessageEmbed({
        title: item.name === 'Pet Cat - Coupon' ? 'Meow!' : 'Bork!',
        description: 'Have fun with your new pet',
        color: 0x2196f3,
      });
    } else if (_.includes(item.properties, 'pet_toy')) {
      const pet = await Pet.findOne({ memberID: this.id }).exec();

      if (!pet || pet.petType !== item.properties[1])
        return new MessageEmbed({
          title: `You don't have a ${item.properties[1]}`,
          description: `The item you're trying to use is intended for ${item.properties[1]}...`,
          color: 0x2196f3,
        });

      const res = await pet.giveToy(item.name);

      if (!res)
        embed = new MessageEmbed({
          title: 'Ooops',
          description: `It seems your ${pet.petType} didn't like the toy, thus it destroyed the ${item.name}`,
          color: 0xf44336,
        });
      else
        embed = new MessageEmbed({
          title: `Your ${pet.petType} seems happy with it's new toy`,
          description: 'It seems your pet likes the new toy you gave it',
          color: 0x2196f3,
        });
    }

    await inventory.save();

    return embed;
  }

  /**
   * Give an item or coins to a user
   *
   * @param type - Type of item to give
   * @param value - Value
   * @param member - User to give item to
   * @returns The Embed containing result
   */
  async give(this: User, type, value, member) {
    const senderInv = await Inventory.findOne({ memberID: this.id });
    const receiverInv = await Inventory.findOne({ memberID: member.id });

    if (!senderInv || !receiverInv) return this._noProfile();

    if (senderInv.memberID === receiverInv.memberID)
      return new MessageEmbed({
        title: 'Oops!',
        description: "You can't give coins/items to yourself",
        color: 0xf44336,
      });

    if (type === 'coins') {
      value = parseInt(value);

      if (senderInv.coins < value || value < 0)
        return new MessageEmbed({
          title: 'Not enough Coins',
          description: "You don't have enough coins",
          color: 0xf44336,
        });

      await senderInv.deductCoins(value);
      await receiverInv.addCoins(value);

      return new MessageEmbed({
        title: `Transaction Successful`,
        color: 0x2196f3,
      })
        .addField('❯ Sender', this.client.users.get(this.id).tag, true)
        .addField('❯ Receiver', this.client.users.get(member.id).tag, true)
        .addField('❯ Amount Sent', value)
        .setTimestamp(Date.now());
    } else if (type === 'item') {
      const res = await senderInv.takeItem(value);

      if (!res)
        return new MessageEmbed()
          .setTitle('Item not found')
          .setDescription(
            "The item you're trying to give doesn't exist in your inventory"
          )
          .setColor('#f44336');

      await receiverInv.giveItem(value);

      return new MessageEmbed({
        title: `Transaction Successful`,
        color: 0x2196f3,
      })
        .addField('❯ Sender', this.client.users.get(this.id).tag, true)
        .addField('❯ Receiver', this.client.users.get(member.id).tag, true)
        .addField('❯ Item Sent', value)
        .setTimestamp(Date.now());
    }
  }

  /**
   * Deposit a number of coins for a period
   *
   * @param period - Period for this deposit in weeks
   * @param coins - Amount of coins to deposit
   * @returns The MessageEmbed to show to the user
   */
  async deposit(this: User, period, coins) {
    const inventory = await Inventory.findOne({ memberID: this.id });
    const bankAccount = await BankAccount.findOne({ memberID: this.id });

    if (!inventory) return this._noProfile(true);

    if (inventory.coins < coins)
      return new MessageEmbed({
        title: 'Insufficient Coins',
        description: "You don't have enough coins to make that deposit",
        color: 0xf44336,
      });

    if (!bankAccount)
      return new MessageEmbed({
        title: 'Bank Account Not Found',
        description:
          'You need a bank account to deposit coins, use `create-account` command to create a bank account\n\nPlease note that it will cost you **500 Coins** to create a bank account',
        color: 0xf44336,
      });

    await inventory.deductCoins(coins);

    if (period === 1) coins = coins * 1.01 ** 1;
    if (period === 4) coins = coins * 1.02 ** 4;
    if (period === 12) coins = coins * 1.03 ** 12;

    coins = Math.round(coins);

    await bankAccount.addDeposit(period, coins);

    return new MessageEmbed({
      title: 'Deposited',
      description: `You have successfully deposited ${coins} Coins for ${period} weeks.`,
      color: 0x2196f3,
    });
  }

  /**
   * Create a new bank account for a user
   *
   * @returns The Embed to show to the user
   */
  async createAccount(this: User) {
    const res = await BankAccount.createAccount(this.id);

    if (res.res === 'already_exists')
      return new MessageEmbed({
        title: 'Bank Account Already exists',
        description: 'You already have a bank account',
        color: 0xf44336,
      });

    if (res.res === 'insufficient_coins')
      return new MessageEmbed({
        title: 'Insufficient Coins',
        description: "You don't have enough coins to create a bank a account",
        color: 0xf44336,
      });

    return new MessageEmbed({
      title: 'Bank Account Created',
      description: 'Congrats, now you have a bank account',
      color: 0x2196f3,
    });
  }

  /**
   * Get Embed for a user's bank account
   *
   * @returns The Embed containing user's Bank Account info
   */
  async getAccountEmbed(this: User) {
    const bankAccount = await BankAccount.findOne({ memberID: this.id });

    if (!bankAccount)
      return new MessageEmbed({
        title: 'Bank Account Not Found',
        description:
          "You don't have a bank account, use `create-account` command to create a bank account\n\nPlease note that it will cost you **500 Coins** to create a bank account",
        color: 0xf44336,
      });

    return new MessageEmbed({
      title: `${this.username}'s Bank Account`,
      description: `**Current Deposits**\n${
        bankAccount.deposits.length > 0
          ? bankAccount.deposits
              .map(
                d =>
                  `• ${numberWithCommas(Math.round(d.coins))} Coins - ${
                    d.daysLeft
                  } Days Left`
              )
              .join('\n')
          : '[No Deposits]'
      }`,
      color: 0x2196f3,
    });
  }

  /**
   * Setup profile for a guild
   *
   * @param guildID - ID of guild to setup this profile for
   * @returns The Embed containing details
   */
  async setupProfile(this: User, guildID) {
    const profile = await Profile.findOne({ memberID: this.id }).exec();

    if (!profile) return this._noProfile(true);

    if (!profile.reputation.find(rep => rep.guildID === guildID))
      profile.reputation.push({
        guildID: guildID,
        rep: this.client.guilds.get(guildID).settings.get('startingRep'),
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
};