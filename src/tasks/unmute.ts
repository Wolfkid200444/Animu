import { Task } from 'klasa';
import { model } from 'mongoose';
import { IProfile } from '../models/Profile';

//Init
const Profile = model('Profile');

module.exports = class extends Task {
  async run({ guild, user }) {
    const _guild = this.client.guilds.get(guild);
    if (!_guild) return;
    const member = await _guild.members.fetch(user).catch(() => null);
    if (!member) return;
    await member.roles.remove(_guild.settings.get('mutedRole'));

    const profile: IProfile = await (<Promise<IProfile>>Profile.findOne({
      memberID: user.id,
    }).exec());

    const index = profile.mutedIn.indexOf(guild.id);

    if (index >= 0) profile.mutedIn.splice(index, 1);

    await profile.save();
  }
***REMOVED***
