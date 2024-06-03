import { MusicEventGen } from "@Environment";
import { Queue, Song } from "distube";
import { GuildTextBasedChannel } from "discord.js";

export default new MusicEventGen({
  Category: 'error',
  Execute(channel: GuildTextBasedChannel, error: Error) {
    channel.send(`:negative_squared_cross_mark: | An error encountered: ${error.toString().slice(0, 1974)}`);
    console.error(error);
  }
})