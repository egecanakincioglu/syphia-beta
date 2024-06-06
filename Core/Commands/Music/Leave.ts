import { SlashCommandBuilder, GuildMember, VoiceChannel, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getLeave;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder().setName('leave').setDescription(Cmd.Description),
  Execute: async (interaction) => {
    const response = await interaction.deferReply({ ephemeral: false });

    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');

    try {
      const member = interaction.member as GuildMember;

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoChannel}`));
      }

      const voiceChannel = member.voice.channel as VoiceChannel;

      const botVoiceChannel = interaction.guild?.members.me.voice.channel;

      if (!botVoiceChannel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoBotChannel}`));
      }

      if (botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.OnlyWithBot}`));
      }

      await PlayerHandler.Player.voices.leave(voiceChannel);
      return response.edit(bold(`${Ayumis}${await getEmoji('AyumiLeave')} ${Cmd.Leaved[0]} \`${voiceChannel.name}\` ${Cmd.Leaved[1]}`));
    } catch (error) {
      console.error(error);
    }
  }
});
