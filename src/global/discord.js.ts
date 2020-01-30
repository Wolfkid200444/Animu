import { IProfile } from '../models/Profile';

declare module 'discord.js' {
  interface User {
    register(): Promise<false | IProfile>;
    getProfileEmbed(guildID: string): Promise<MessageEmbed>;
    editProfile(key: string, value: string): Promise<MessageEmbed>;
    getBadgesEmbed(guildID: string): Promise<MessageEmbed>;
    setActiveBadge(badgeName: string, guildID: string): Promise<boolean>;
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
