const keys =
  process.env.NODE_ENV === 'production' ? require('./prod') : require('./dev');

const mongoConnectionString: string = keys.mongoConnectionString;
const discordBotToken: string = keys.DISCORD_BOT_TOKEN;
const youtubeAPIKey: string = keys.YOUTUBE_API_KEY;
const animuAPIKey: string = keys.ANIMU_API_KEY;
const nasaAPIKey: string = keys.NASA_API_KEY;
const booksAPIKey: string = keys.BOOKS_API_KEY;
const websterAPIKey: string = keys.WEBSTER_API_KEY;
const deviantartClientID: string = keys.DEVIANTART_CLIENT_ID;
const deviantartClientSecret: string = keys.DEVIANTART_CLIENT_SECRE;
const githubUsername: string = keys.GITHUB_USERNAME;
const githubPassword: string = keys.GITHUB_PASSWORD;
const pixivUsername: string = keys.PIXIV_USERNAME;
const pixivPassword: string = keys.PIXIV_PASSWORD;
const TMBDAPIKey: string = keys.TMDB_API_KEY;
const OSUAPIKey: string = keys.OSU_API_KEY;
const stackoverflowKey: string = keys.STACKOVERFLOW_KEY;
const alphaVantageAPIKey: string = keys.ALPHA_VANTAGE_API_KEY;
const openWeatherAPIKey: string = keys.OPEN_WEATHER_API_KEY;
const perspectiveAPIKey: string = keys.PERSPECTIVE_API_KEY;
const lavalinkPassword: string = keys.LAVALINK_PASSWORD;
const botEnv: string = keys.BOT_ENV;

export {
  mongoConnectionString,
  discordBotToken,
  youtubeAPIKey,
  animuAPIKey,
  nasaAPIKey,
  booksAPIKey,
  websterAPIKey,
  deviantartClientID,
  deviantartClientSecret,
  githubUsername,
  githubPassword,
  pixivUsername,
  pixivPassword,
  TMBDAPIKey,
  OSUAPIKey,
  stackoverflowKey,
  alphaVantageAPIKey,
  openWeatherAPIKey,
  perspectiveAPIKey,
  lavalinkPassword,
  botEnv,
***REMOVED***
