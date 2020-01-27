const keys =
  process.env.NODE_ENV === 'production' ? require('./prod') : require('./dev');

const mongoConnectionString: string = keys.mongoConnectionString;
const discordBotToken: string = keys.discordBotToken;
const youtubeAPIKey: string = keys.youtubeAPIKey;
const animuAPIKey: string = keys.animuAPIKey;
const nasaAPIKey: string = keys.nasaAPIKey;
const booksAPIKey: string = keys.booksAPIKey;
const websterAPIKey: string = keys.websterAPIKey;
const deviantartClientID: string = keys.deviantartClientID;
const deviantartClientSecret: string = keys.deviantartClientSecret;
const githubUsername: string = keys.githubUsername;
const githubPassword: string = keys.githubPassword;
const pixivUsername: string = keys.pixivUsername;
const pixivPassword: string = keys.pixivPassword;
const TMBDAPIKey: string = keys.TMBDAPIKey;
const OSUAPIKey: string = keys.OSUAPIKey;
const stackoverflowKey: string = keys.stackoverflowKey;
const alphaVantageAPIKey: string = keys.alphaVantageAPIKey;
const openWeatherAPIKey: string = keys.openWeatherAPIKey;
const perspectiveAPIKey: string = keys.perspectiveAPIKey;
const lavalinkPassword: string = keys.lavalinkPassword;
const botEnv: string = keys.botEnv;

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
