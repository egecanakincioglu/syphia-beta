import { Logger, MusicEventGen, PlayerHandler, PlayerInterface, getEmoji } from "@Environment";
import { Queue, Song } from "distube";
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, bold } from 'discord.js'; 
import { createTimeout } from "Environment/Functions/Util";
import { PrivateGuildSettings } from "@Database";

export default new MusicEventGen({
  Category: 'playSong',
  async Execute(queue: Queue, song: Song) {
    try {
      const privateGuildSettings = new PrivateGuildSettings();
      await privateGuildSettings.setAllSettings();
      await createTimeout(50);

      const interaction = PlayerHandler.interactionMap.get(queue.id);
      const PlaySongMessage = bold(`Playing ${await getEmoji('AyumiMusic')} \`${song.name}\` - Now`);

      if (interaction) {
        PlayerHandler.interactionMap.delete(queue.id);
        if (interaction instanceof ChatInputCommandInteraction || interaction instanceof ButtonInteraction) {
          await (interaction.replied ? interaction.followUp(PlaySongMessage) : interaction.reply(PlaySongMessage));
        } else {
          await interaction.edit(PlaySongMessage);
        }
      }
    } catch (error) {
      Logger.error('Bir hata muhammede geldi:');
      console.error(error);
    }
  }
});
