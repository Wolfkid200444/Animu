import { Task } from 'klasa';
import { model } from 'mongoose';
import { IProfileModel } from '../models/Profile';

//Init
const Profile: IProfileModel = <IProfileModel>model('Profile');

module.exports = class extends Task {
  async run({ guild, user }) {
    const _guild = this.client.guilds.get(guild);
    if (!_guild) return;
    const member = await _guild.members.fetch(user).catch(() => null);
    if (!member) return;
    await member.roles.remove(_guild.settings.get('mutedRole'));

    const profile = await Profile.findOne({
      memberID: user.id,
    }).exec();

    const index = profile.mutedIn.indexOf(guild.id);

    if (index >= 0) profile.mutedIn.splice(index, 1);

    await profile.save();
  }
};
