const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Partner = mongoose.model('Partner');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['initialize'],
      cooldown: 60,
      permissionLevel: 10,
      description: 'Initialize Aldovia Network',
      extendedHelp:
        'Creates channels, roles & other stuff necessary for Aldovia Network',
      usage: '<inviteLink:string> <description:...string{10,256}>',
      usageDelim: ' ',
      quotedStringSupport: true
    });
  }

  async run(msg, [inviteLink, description]) {
    //Validation
    if (msg.guild.id === '556442896719544320')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Can't init here")
          .setDescription(
            "Can't initialize in Aldovia, this command can only be used in partner servers"
          )
          .setColor('#f44336')
      );

    const partner = await Partner.findOne({ guildID: msg.guild.id }).exec();

    if (partner)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Already initialized')
          .setDescription(
            'Aldovia network is already initialized in this server'
          )
          .setColor('#f44336')
      );

    //Sending Init message
    const initMsg = await msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Initializing')
        .setDescription('Creating Roles')
        .setColor('#2196f3')
    );

    //Create Roles
    //-> Aldovia Representative Role
    const representativeRole = await msg.guild.roles.create({
      data: {
        name: 'Aldovia Representative',
        permissions: ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES']
      },
      reason: 'Creating role for Aldovia Representative'
    });

    //-> Network Partner Role
    const partnerRole = await msg.guild.roles.create({
      data: {
        name: 'Network Partner'
      },
      reason: 'Creating role for Network partners'
    });

    //Create channels
    await initMsg.edit(
      new MessageEmbed()
        .setTitle('Initializing')
        .setDescription('Creating Channels')
        .setColor('#2196f3')
    );

    //-> Aldovia Network Category
    const aldoviaNetworkCategory = await msg.guild.channels.create(
      'Aldovia Network',
      {
        type: 'category'
      }
    );

    //-> Aldovia network servers
    const networkServersChannel = await msg.guild.channels.create(
      'network-servers',
      {
        topic: `Aldovia Network | ${this.client.settings.aldoviaInviteLink}`,
        parent: aldoviaNetworkCategory.id,
        permissionOverwrites: [
          {
            id: msg.guild.defaultRole.id,
            allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
            deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
          }
        ],
        reason: 'Created For Aldovia Network'
      }
    );

    //-> Aldovia Network Chat
    msg.guild.channels.create('aldovia-network-room', {
      topic: 'Channel for network server representatives',
      parent: aldoviaNetworkCategory.id,
      permissionOverwrites: [
        {
          id: representativeRole.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES']
        },
        {
          id: partnerRole.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES']
        },
        {
          id: msg.guild.defaultRole.id,
          deny: ['VIEW_CHANNEL']
        }
      ],
      reason: 'Created For Aldovia Network'
    });

    //Assign Roles
    await initMsg.edit(
      new MessageEmbed()
        .setTitle('Initializing')
        .setDescription('Assigning Roles')
        .setColor('#2196f3')
    );

    //-> Aldovia Representative
    msg.member.roles.add(
      representativeRole.id,
      'Assigning Aldovia Representative Role'
    );

    //Listing Servers
    await initMsg.edit(
      new MessageEmbed()
        .setTitle('Initializing')
        .setDescription('Listing Servers')
        .setColor('#2196f3')
    );

    //-> List partner servers
    const partners = await Partner.find({}).exec();

    //-> Listing
    if (partners.length > 0)
      partners.forEach(async partner => {
        networkServersChannel.send(
          `**${this.client.guilds.get(partner.guildID).name}**\n\`\`\`${
            partner.description
          }\`\`\`\n${partner.inviteLink}`
        );

        const ch = this.client.guilds
          .get(partner.guildID)
          .channels.get(partner.networkServersChannelID);

        ch.send(
          `**${msg.guild.name}**\n\`\`\`${description}\`\`\`\n${inviteLink}`
        );
      });

    //-> List Aldovia
    const aldoviaMsg = await networkServersChannel.send(
      `**Aldovia**\n\`\`\`${this.client.settings.aldoviaDescription}\`\`\`\n${
        this.client.settings.aldoviaInviteLink
      }`
    );

    aldoviaMsg.pin();

    //Finalizing
    await initMsg.edit(
      new MessageEmbed()
        .setTitle('Initializing')
        .setDescription('Finalizing')
        .setColor('#2196f3')
    );

    //-> Saving to DB
    await new Partner({
      guildID: msg.guild.id,
      description,
      networkServersChannelID: networkServersChannel.id,
      inviteLink
    }).save();

    //Done
    await initMsg.edit(
      new MessageEmbed()
        .setTitle('Initialized')
        .setDescription('Initialization Complete')
        .setColor('#2196f3')
    );
  }
***REMOVED***
