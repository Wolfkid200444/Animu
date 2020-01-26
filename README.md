# Animu

[![Build Status](https://travis-ci.org/LightYagami200/Animu.svg?branch=master)](https://travis-ci.org/LightYagami200/Animu) [![Dependencies Status](https://david-dm.org/LightYagami200/Animu.svg)](https://david-dm.org/LightYagami200/Animu) [![Discord Server](https://discordapp.com/api/guilds/556442896719544320/embed.png)](https://discord.gg/JGsgBsN) [![Become a Patron](https://img.shields.io/badge/patreon-donate-orange.svg)](https://www.patreon.com/Aldovia) ![GitHub](https://img.shields.io/github/license/LightYagami200/Animu)

## Hosting Animu on your own server

### Requirements

- Discord Bot Account ([https://discordapp.com/developers/applications/](https://discordapp.com/developers/applications/))
- NodeJS/NPM ([https://nodejs.org/en/download/](https://nodejs.org/en/download/))
- Git ([https://git-scm.com/downloads](https://git-scm.com/downloads))
- TypeScript (`npm i -g typescript`)
- PM2 (`npm i -g pm2`)
- Dotenv (`npm i -g dotenv`)
- Redis (https://redis.io/download)
- MongoDB ([https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- Lavalink (`https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1`)

### Let's Begin

Run this command first to clone Animu to your computer/server:

```
git clone https://github.com/LightYagami200/Animu
```

Now cd in the directory, and create a `.env` file in there using this template:

```env
# Database
MONGO_CONNECTION_STRING=

# Discord
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Google APIs
YOUTUBE_API_KEY=
BOOKS_API_KEY=
PERSPECTIVE_API_KEY=

# Github
GITHUB_USERNAME=
GITHUB_PASSWORD=

# Pixiv
PIXIV_USERNAME=
PIXIV_PASSWORD=

# Deviantart
DEVIANTART_CLIENT_ID=
DEVIANTART_CLIENT_SECRET=

# ANIMU API
ANIMU_API_KEY= You can define any API Key here that you'd like to use for webhooks

# Nasa
NASA_API_KEY=

# Webster
WEBSTER_API_KEY=

# TMDB
TMDB_API_KEY=

# OSU
OSU_API_KEY=

# Stackoverflow
STACKOVERFLOW_KEY=

# Alpha Vantage
ALPHA_VANTAGE_API_KEY=

# Weather
OPEN_WEATHER_API_KEY=

# Lavalink
LAVALINK_PASSWORD=

# Environment
BOT_ENV=production
```

Once that's done, you just have to run this command:

```
pm2 start
```

And you're done!
