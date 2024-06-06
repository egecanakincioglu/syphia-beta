import { GuildMember, SlashCommandBuilder, ChannelType, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getPlayNow;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('playnow')
    .setDescription(Cmd.Description)
    .addStringOption((option) => option.setName(Cmd.Options.Name).setDescription(Cmd.Options.Description).setRequired(true)),
  Execute: async (interaction) => {
    const songQuery = interaction.options.getString(Cmd.Options.Name);
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Playnow komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoVoice}`));
      }

      if (voiceChannel.type === ChannelType.GuildStageVoice) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.StageNotAllowed}`));
      }

      if (!voiceChannel.joinable) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.Joinable}`));
      }

      if (!voiceChannel.speakable) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.Speakable}`));
      }

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.ChannelNotAllowed}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (queue && queue.playing) {
        PlayerHandler.Player.stop(interaction.guildId);
      }

      await PlayerHandler.Player.play(voiceChannel, songQuery, { textChannel: interaction.channel, member: interaction.member as GuildMember });

      return PlayerHandler.interactionMap.set(queue.id, response);
    } catch (error) {
      console.error(error);
    }
  }
});
