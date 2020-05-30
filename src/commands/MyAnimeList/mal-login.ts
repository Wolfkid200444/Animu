import { Command, CommandStore, KlasaMessage } from "klasa";
import { MessageEmbed } from "discord.js";
import _ from "lodash";

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ["dm"],
      cooldown: 5,
      description: "Login on MAL",
      extendedHelp:
        "Login on MyAnimeList\n\nNOTE: Your MAL username & password will be saved in database",
      usage: "<username:string> <password:string>",
      usageDelim: " ",
    });
  }

  async run(msg: KlasaMessage, [username, password]: [string, string]) {
    return msg.send("Command under development");

    const res = await msg.author.loginMAL(username, password);

    if (res) return msg.send(res);

    msg.send(
      new MessageEmbed({
        title: "Logged In successfully",
        description: "Congrats, You have successfully logged in on MyAnimeList",
        color: 0x2196f3,
      })
    );
  }
}
