import { SlashCommandBuilder, GuildMember, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getSkip;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder().setName('skip').setDescription(Cmd.Description),
  Execute: async (interaction) => {
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');
    const AyumiMusic = await getEmoji('AyumiMusic');
    const KlausTimeout = await getEmoji('KlausTimeout');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Skip komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoVoice}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoSong}`));
      }

      if (queue.songs.length === 0) {
        return response.edit(bold(`${Ayumis}${AyumiMusic} ${Cmd.NoQueue}`));
      }

      if (queue.songs.length === 1) {
        response.edit(bold(`${Ayumis}${KlausTimeout} ${Cmd.Skipped} \`${queue.songs[0].name}\``));
        interaction.channel.send(bold(`${Ayumis}${AyumiMusic} ${Cmd.NoQueue}`));
        return await PlayerHandler.Player.stop(interaction.guildId);
      }

      await PlayerHandler.Player.skip(interaction.guildId);

      return response.edit(bold(`${Ayumis}${KlausTimeout} ${Cmd.Skipped} \`${queue.songs[0].name}\``));
    } catch (error) {
      console.error(error);
    }
  }
});
