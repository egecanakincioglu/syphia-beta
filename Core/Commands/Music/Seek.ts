import { SlashCommandBuilder, GuildMember, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getSeek;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('seek')
    .setDescription(Cmd.Description)
    .addIntegerOption((option) => option.setName(Cmd.Options.Name).setDescription(Cmd.Options.Description).setRequired(true)),
  Execute: async (interaction) => {
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');
    const response = await interaction.deferReply({ ephemeral: false });

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Seek komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoVoice}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoSong}`));
      }

      if (!queue.playing) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NotPlaying}`));
      }

      const seekTime = interaction.options.getInteger(Cmd.Options.Name);

      if (seekTime <= 0) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.InvalidTime}`));
      }

      queue.seek(seekTime);

      return response.edit(bold(`${Ayumis}:fast_forward: ${Cmd.Success} \`${seekTime}\``));
    } catch (error) {
      console.error(error);
    }
  }
});
