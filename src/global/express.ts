import { KlasaUser, KlasaGuild } from 'klasa';
import { GuildMember, GuildChannel, Role } from 'discord.js';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: KlasaUser;
    guild?: KlasaGuild;
    member?: GuildMember;
    channel?: GuildChannel;
    role?: Role;
    tier?: string;
  }
}
