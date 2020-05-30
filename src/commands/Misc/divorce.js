const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const prompt = require("discordjs-prompter");

//Init
const Profile = mongoose.model("Profile");
const Inventory = mongoose.model("Inventory");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ["text"],
      aliases: ["divorce"],
      requiredPermissions: ["EMBED_LINKS"],
      cooldown: 60,
      description: "Divorce your partner",
      extendedHelp: "Divorce your partner",
    });
  }

  async run(msg) {
    const profile = await Profile.findOne({
      memberID: msg.member.id,
    }).exec();

    if (!profile)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Profile not found")
          .setDescription("Use `-register` to register your profile")
          .setColor("#f44336")
      );

    if (profile.marriedTo === "")
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Not married")
          .setDescription(
            "You can't divorce your partner when you don't even have a partner! BIG OOPSIE"
          )
          .setColor("#f44336")
      );

    const inventory = await Inventory.findOne({
      memberID: msg.member.id,
    }).exec();

    const index = inventory.inventory.indexOf("Divorce Contract");

    if (index < 0)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Divorce Contract not found")
          .setDescription(
            "You need a `Divorce Contract` in your inventory to divorce your partner"
          )
          .setColor("#f44336")
      );

    const res = await prompt.reaction(msg.channel, {
      question: `${msg.member}, Are you sure you wanna divorce your partner?`,
      userId: msg.author.id,
    });

    if (!res || res === "no")
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Cancelled")
          .setDescription(`Divorce Cancelled`)
          .setColor("#f44336")
      );

    const profileToDivorce = await Profile.findOne({
      memberID: profile.marriedTo,
    }).exec();

    profile.marriedTo = "";
    profileToDivorce.marriedTo = "";
    inventory.inventory.splice(index, 1);

    await inventory.save();
    await profile.save();
    await profileToDivorce.save();

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle("Divorced...")
        .setDescription(`${msg.member.displayName} divorced their partner...`)
        .setColor("#2196f3")
    );
  }
};
