import { SlashCommandBuilder, GuildMember, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getPause;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('pause')
    .setDescription(Cmd.Description),
  Execute: async (interaction) => {
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');
    const KlausPlay = await getEmoji('KlausPlay');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;
      
      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Pause komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoChannel}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoSong}`));
      }

      PlayerHandler.Player.pause(interaction.guildId);

      return response.edit(bold(`${Ayumis}${KlausPlay} ${Cmd.Paused}`));

    } catch (error) {
      console.error(error);
    }
  },
});
