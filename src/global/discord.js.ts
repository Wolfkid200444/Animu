import { IProfile } from '../models/Profile';

declare module 'discord.js' {
  interface User {
    register(): Promise<false | IProfile>;
    getProfileEmbed(guildID: string): Promise<MessageEmbed>;
    addExp(expToAdd: number, guildID: string): Promise<Array<number>>;
    giveBadge(badgeName: string, guildID: string): Promise<boolean>;
    editReputation(
      change: '+' | '-',
      amoung: number,
      guildID: string
    ): Promise<boolean>;
    _noProfile(isAuthor?: boolean): MessageEmbed;
  }
}
