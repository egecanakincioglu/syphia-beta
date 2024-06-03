import { SlashCommandBuilder, GuildMember, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getRewind;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('rewind')
    .setDescription(Cmd.Description)
    .addIntegerOption(option =>
      option.setName(Cmd.Options.Name)
        .setDescription(Cmd.Options.Description)
        .setRequired(true)),
  Execute: async (interaction) => {
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');
    const response = await interaction.deferReply({ ephemeral: false });

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;
      
      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Rewind komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
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

      const rewindTime = interaction.options.getInteger(Cmd.Options.Name);

      if (rewindTime <= 0) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.InvalidTime}`));
      }

      const newPosition = Math.max(0, queue.currentTime - rewindTime);
      PlayerHandler.Player.seek(interaction.guildId, newPosition);

      return response.edit(bold(`${Ayumis}:rewind: ${Cmd.Rewinded[0]} \`${rewindTime}\` ${Cmd.Rewinded[1]}`));

    } catch (error) {
      console.error(error);
    }
  },
});
