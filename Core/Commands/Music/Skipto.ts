import { GuildMember, SlashCommandBuilder, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getSkipTo;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription(Cmd.Description)
    .addIntegerOption(option =>
      option.setName(Cmd.Options.Name)
        .setDescription(Cmd.Options.Description)
        .setRequired(true)
    ),
  Execute: async (interaction) => {
    const skipToIndex = interaction.options.getInteger(Cmd.Options.Name);
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;
      
      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} SkipTo komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoVoice}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue || !queue.songs.length) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.EmptyQueue}`));
      }

      if (!Number.isInteger(skipToIndex) || skipToIndex <= 0 || skipToIndex > queue.songs.length) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.InvalidIndex}`));
      }

      if (skipToIndex === 1) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.CurrentSong}`))
      }

      const song = await queue.jump(skipToIndex - 1);

      return response.edit(bold(`${Ayumis} ${Cmd.Success} ${song.name}`));
    } catch (error) {
      console.error(error);
    }
  },
});
