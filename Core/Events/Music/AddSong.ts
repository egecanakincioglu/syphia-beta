import { MusicEventGen, PlayerHandler } from '@Environment';
import { Queue, Song } from 'distube';
import { EmbedBuilder } from 'discord.js';
import { createTimeout } from 'Environment/Functions/Util';

export default new MusicEventGen({
  Category: 'addSong',
  async Execute(queue: Queue, song: Song) {
    await createTimeout(50);

    const { AddSongEmbed } = AddSong.ReplaceAddSongEvent(song, queue);

    const interaction = PlayerHandler.interactionMap.get(queue.id);
    const messageData = { embeds: [AddSongEmbed] };

    if (interaction) {
      PlayerHandler.interactionMap.delete(queue.id);
      return interaction.edit(messageData);
    }

    return queue.textChannel.send({ embeds: [AddSongEmbed] });
  }
});

class AddSong {
  public static AddSong = new EmbedBuilder();

  public static ReplaceAddSongEvent(song: Song, queue: Queue) {
    return {
      AddSongEmbed: this.AddSong.setAuthor({
        name: 'Track Added to Queue',
        iconURL: 'https://cdn.discordapp.com/attachments/1204859081186082899/1207707726738628618/ayumi-playing.webp'
      })
        .setThumbnail(song.thumbnail)
        .setFields(
          {
            name: 'Added the queue:',
            value: `**[${song.name}](${song.url})**`,
            inline: false
          },
          {
            name: 'Requested by:',
            value: `${song.member}`,
            inline: true
          },
          {
            name: 'Track Duration:',
            value: `\`${song.formattedDuration}\``,
            inline: true
          },
          {
            name: 'Loudness:',
            value: `\`${queue.volume}%\``,
            inline: true
          },
          {
            name: 'Audio Filter:',
            value: `\`${queue.filters.names.join(', ') || 'Disable'}\``,
            inline: true
          },
          {
            name: 'Loop Mode:',
            value: `\`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Songs') : 'Disable'}\``,
            inline: true
          },
          {
            name: 'Autoplay:',
            value: `\`${queue.autoplay ? 'Enable' : 'Disable'}\``,
            inline: true
          }
        )
        .setFooter({
          text: `Requested by ${song.member.displayName}`,
          iconURL: song.user.avatarURL()
        })
    };
  }
}
