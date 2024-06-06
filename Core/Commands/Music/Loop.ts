import { SlashCommandBuilder, GuildMember, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getLoop;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('loop')
    .setDescription(Cmd.Description)
    .addStringOption((option) =>
      option
        .setName(Cmd.Options.Name)
        .setDescription(Cmd.Options.Description)
        .setRequired(true)
        .addChoices({ name: Cmd.Options.Track, value: 'song' }, { name: Cmd.Options.Queue, value: 'queue' }, { name: Cmd.Options.Disable, value: 'off' })
    ),
  Execute: async (interaction) => {
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');
    const AyumiCark = await getEmoji('AyumiCark');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Loop komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoVoice}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoSong}`));
      }

      const loopMode = interaction.options.getString(Cmd.Options.Name);

      switch (loopMode) {
        case 'song':
          const isSongLooped = queue.setRepeatMode(1);
          return response.edit(bold(`${Ayumis}${AyumiCark} ${Cmd.TrackLoop} \`${isSongLooped ? Cmd.LoopString.Enabled : Cmd.LoopString.Disabled}\``));

        case 'queue':
          const isQueueLooped = queue.setRepeatMode(2);
          return response.edit(bold(`${Ayumis}${AyumiCark} ${Cmd.QueueLoop} \`${isQueueLooped ? Cmd.LoopString.Enabled : Cmd.LoopString.Disabled}\``));

        case 'off':
          queue.setRepeatMode(0);
          return response.edit(bold(`${Ayumis}${AyumiCark} ${Cmd.LoopDisabled}`));

        default:
          return response.edit(bold(`${Ayumis}${AyumiCark} ${Cmd.InavlidMode}`));
      }
    } catch (error) {
      console.error(error);
    }
  }
});
