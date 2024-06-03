import { GuildMember, SlashCommandBuilder, ChannelType, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getPlay;
const General = new Strings().getGeneral;
const Emojis = new Strings().getUnicodeEmojis;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('play')
    .setDescription(Cmd.Description)
    .addStringOption(option =>
      option.setName(Cmd.Options.Name)
        .setDescription(Cmd.Options.Description)
        .setRequired(true)
    ),
  Execute: async (interaction) => {
    const songQuery = interaction.options.getString(Cmd.Options.Name);
    const response = await interaction.deferReply({ ephemeral: false });

    const Reply = await getEmoji('SyphiaReply');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (!voiceChannel) {
        return response.edit(bold(`${Reply}${Emojis.Error} ${General.NoChannel}`));
      }

      if (voiceChannel.type === ChannelType.GuildStageVoice) {
        return response.edit(bold(`${Reply}${Emojis.Error} ${General.StageNotAllowed}`));
      }

      if (!voiceChannel.joinable) {
        return response.edit(bold(`${Reply}${Emojis.Error} ${Cmd.Joinable}`));
      }

      if (!voiceChannel.speakable) {
        return response.edit(bold(`${Reply}${Emojis.Error} ${Cmd.Speakable}`));
      }

      const botVoiceChannelId = botVoiceChannel?.id;
      if (botVoiceChannelId && botVoiceChannelId !== voiceChannel.id) {
        return response.edit(bold(`${Reply}${Emojis.Error} ${General.DifferentChannel}`));
      }

      await PlayerHandler.Player.play(voiceChannel, songQuery, { textChannel: interaction.channel, member });

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);
      return PlayerHandler.interactionMap.set(queue.id, response);
    } catch (error) {
      console.error(error);
    }
  },
});
