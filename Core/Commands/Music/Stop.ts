import { GuildMember, SlashCommandBuilder, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getStop;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder().setName('stop').setDescription(Cmd.Description),
  Execute: async (interaction) => {
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Stop komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoVoice}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoSong}`));
      }

      PlayerHandler.Player.stop(interaction.guildId);
      return response.edit(bold(`${Ayumis}:octagonal_sign: ${Cmd.Stopped}`));
    } catch (error) {
      console.error(error);
    }
  }
});
