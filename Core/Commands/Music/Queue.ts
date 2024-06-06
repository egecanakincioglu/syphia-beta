import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';
import { Song } from 'distube';

const Cmd = new Strings().getQueue;
const pageLimit = 10;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder().setName('queue').setDescription(Cmd.Description),
  Execute: async (interaction) => {
    const AyumiHata = await getEmoji('AyumiHata');
    const AyumiMusic = await getEmoji('AyumiMusic');
    const AyumiOnay = await getEmoji('AyumiOnay');
    const response = await interaction.deferReply({ ephemeral: false });

    try {
      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue || !queue.songs.length) {
        return response.edit(bold(`${AyumiHata} ${Cmd.EmptyQueue}`));
      }

      let page = 1;
      const totalPages = Math.ceil(queue.songs.length / pageLimit);
      const startIdx = (page - 1) * pageLimit;
      const endIdx = page * pageLimit;
      const currentSongs = queue.songs.slice(startIdx, endIdx);
      const embed = generateQueueEmbed(interaction, currentSongs, page, totalPages, queue, AyumiMusic);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('previous').setLabel('Previous page').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('next').setLabel('Next page').setStyle(ButtonStyle.Success)
      );

      await response.edit({ embeds: [embed], components: [row] });

      const filter = (i) => {
        i.deferUpdate();
        return ['previous', 'next'].includes(i.customId) && i.user.id === interaction.user.id;
      };

      const collector = response.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async (i) => {
        if (!i.isButton()) return;

        if (i.customId === 'previous') {
          page = page > 1 ? page - 1 : totalPages;
        } else if (i.customId === 'next') {
          page = page < totalPages ? page + 1 : 1;
        }

        const startIdx = (page - 1) * pageLimit;
        const endIdx = page * pageLimit;
        const currentSongs = queue.songs.slice(startIdx, endIdx);
        const updatedEmbed = generateQueueEmbed(interaction, currentSongs, page, totalPages, queue, AyumiMusic);

        await i.message.edit({ embeds: [updatedEmbed] });
      });

      collector.on('end', () => {
        row.components.forEach((component) => component.setDisabled(true));
        response.edit({ components: [row] });
      });
    } catch (error) {
      console.error(error);
    }
  }
});

function generateQueueEmbed(interaction, songs: Song[], page: number, totalPages: number, queue, AyumiMusic) {
  const embed = new EmbedBuilder()
    .setTitle(`Queue for ${interaction.guild.name}`)
    .setDescription(
      songs
        .map((song, index) => `\`${(page - 1) * pageLimit + index + 1}.\` **[${song.name}](${song.url}) | \`${song.formattedDuration} Requested by: ${song.user.displayName}\`**`)
        .join('\n') +
        `\n` +
        bold(`${AyumiMusic} ${queue.songs.length} songs in queue | ${queue.formattedDuration} total length`)
    )
    .setThumbnail(interaction.guild.iconURL())
    .setFooter({
      text: `Page ${page}/${totalPages} | Loop Mode: ${queue.repeatMode ? (queue.repeatMode >= 1 ? `✅` : `✅`) : `❌`} | Autoplay: ${queue.autoplay ? `✅` : `❌`}`,
      iconURL: interaction.user.avatarURL()
    });

  return embed;
}
