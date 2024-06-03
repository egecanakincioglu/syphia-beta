import { MusicEventGen, Strings, getEmoji } from "@Environment";
import { bold } from "discord.js";
import { Queue, Song } from "distube";

export default new MusicEventGen({
  Category: 'finish',
  async Execute(queue: Queue) {
    const Cmd = new Strings().getGeneral;
    const Reply = await getEmoji('SyphiaReply');
    const Music = await getEmoji('SyphiaMusic');
    await queue.textChannel.send(bold(`${Reply}${Music} ${Cmd.NoQueue}`));
  }
})