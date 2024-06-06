import { SlashCommandBuilder, GuildMember, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getForward;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('forward')
    .setDescription(Cmd.Description)
    .addIntegerOption((option) => option.setName(Cmd.Options.Name).setDescription(Cmd.Options.Description).setRequired(true)),
  Execute: async (interaction) => {
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Forward komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoChannel}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoQueue}`));
      }

      if (!queue.playing) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoPlaying}`));
      }

      const seekTime = interaction.options.getInteger(Cmd.Options.Name);

      if (seekTime <= 0) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.InvalidTime}`));
      }

      PlayerHandler.Player.seek(interaction.guildId, queue.currentTime + seekTime);

      return response.edit(bold(`${Ayumis}:fast_forward: ${Cmd.Response[0]} \`${seekTime}\` ${Cmd.Response[1]}`));
    } catch (error) {
      console.error(error);
    }
  }
});
