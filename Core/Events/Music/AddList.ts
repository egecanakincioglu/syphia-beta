import { MusicEventGen, PlayerHandler } from '@Environment';
import { createTimeout } from 'Environment/Functions/Util';
import { Playlist, Queue } from 'distube';
import { EmbedBuilder } from 'discord.js';

export default new MusicEventGen({
  Category: 'addList',
  async Execute(queue: Queue, playlist: Playlist) {
    await createTimeout(50);

    const { AddListEmbed } = AddList.ReplaceSongEvent(playlist, queue);

    const interaction = PlayerHandler.interactionMap.get(queue.id);
    const messageData = { embeds: [AddListEmbed] };

    if (interaction) {
      PlayerHandler.interactionMap.delete(queue.id);
      return interaction.edit(messageData);
    }

    return queue.textChannel.send({ embeds: [AddListEmbed] });
  }
});

export class AddList {
  public static PlaySongEmbed = new EmbedBuilder();

  public static ReplaceSongEvent(playlist: Playlist, queue: Queue) {
    return {
      AddListEmbed: this.PlaySongEmbed.setAuthor({
        name: 'Playing List',
        iconURL: 'https://cdn.discordapp.com/attachments/1204859081186082899/1207707726738628618/ayumi-playing.webp'
      })
        .setThumbnail(playlist.thumbnail)
        .setFields(
          {
            name: 'List Name:',
            value: `**[${playlist.name}](${playlist.url})**`,
            inline: false
          },
          {
            name: 'Requested by:',
            value: `${playlist.member}`,
            inline: true
          },
          {
            name: 'Number of Songs in the List:',
            value: `\`${playlist.songs.length} Songs\``,
            inline: true
          },
          {
            name: 'List Duration:',
            value: `\`${playlist.formattedDuration}\``,
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
          text: `Requested by ${playlist.member.displayName}`,
          iconURL: playlist.user.avatarURL()
        })
    };
  }
}
