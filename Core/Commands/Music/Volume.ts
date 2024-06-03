import { GuildMember, SlashCommandBuilder, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';
import { Settings } from '@Database';

const Cmd = new Strings().getVolume;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('volume')
    .setDescription(Cmd.Description)
    .addIntegerOption(option =>
      option.setName(Cmd.Options.Name)
        .setDescription(Cmd.Options.Description)
        .setRequired(false)),
  Execute: async (interaction) => {

    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');
    const KlauSes = await getEmoji('KlausSes');
    const response = await interaction.deferReply({ ephemeral: false });

    try {
      const member = interaction.member as GuildMember;
      const guildId = interaction.guildId;
      const volumeLevel = interaction.options.getInteger(Cmd.Options.Name, false);

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;
      
      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Filter komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoSong}`));
      }

      if (volumeLevel !== null && (volumeLevel < 0 || volumeLevel > 100)) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.InvalidVolume}`));
      }

      let settings = (await Settings.findOne({ guildId })) ?? new Settings({ guildId });

      if (volumeLevel !== null) {
        settings.volume = volumeLevel;
        await settings.save();
        PlayerHandler.Player.setVolume(guildId, volumeLevel);
        return response.edit(bold(`${Ayumis}${KlauSes} ${Cmd.VolumeSet[0]} \`${volumeLevel}\` ${Cmd.VolumeSet[1]}`));
      } else {
        return response.edit(bold(`${Ayumis}${KlauSes} ${Cmd.AvaibleVolume} \`${settings.volume}\``));
      }
    } catch (error) {
      console.error(error);
    }
  },
});