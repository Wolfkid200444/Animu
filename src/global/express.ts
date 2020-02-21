import { KlasaUser, KlasaGuild } from 'klasa';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: KlasaUser;
    guild?: KlasaGuild;
  }
}
