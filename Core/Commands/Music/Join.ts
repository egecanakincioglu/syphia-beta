import { SlashCommandBuilder, GuildMember, VoiceChannel, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getJoin;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder().setName('join').setDescription(Cmd.Description),
  Execute: async (interaction) => {
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');
    const response = await interaction.deferReply({ ephemeral: false });

    try {
      const member = interaction.member as GuildMember;

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoChannel}`));
      }

      const voiceChannel = member.voice.channel as VoiceChannel;
      const botVoiceChannel = interaction.guild?.members.me.voice.channel;

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (queue && queue.songs.length > 0) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.AlreadyPlaying}`));
      }

      if (voiceChannel === botVoiceChannel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.AlreadyWithYou}`));
      }

      if (voiceChannel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.AlreadyJoined}`));
      }

      if (voiceChannel !== botVoiceChannel) {
        await PlayerHandler.Player.voices.join(voiceChannel);
        return response.edit(bold(`${Ayumis}${await getEmoji('AyumiJoin')} ${Cmd.Joined[0]} \`${voiceChannel.name}\`${Cmd.Joined[1]}`));
      }
    } catch (error) {
      console.error(error);
    }
  }
});
