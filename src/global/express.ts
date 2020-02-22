import { KlasaUser, KlasaGuild } from 'klasa';
import { GuildMember } from 'discord.js';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: KlasaUser;
    guild?: KlasaGuild;
    member?: GuildMember;
    tier?: string;
  }
}
