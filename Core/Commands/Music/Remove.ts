import { GuildMember, SlashCommandBuilder, bold } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getRemove;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('remove')
    .setDescription(Cmd.Description)
    .addIntegerOption((option) => option.setName(Cmd.Options.Name).setDescription(Cmd.Options.Description).setRequired(true)),
  Execute: async (interaction) => {
    const removeIndex = interaction.options.getInteger(Cmd.Options.Name);
    const response = await interaction.deferReply({ ephemeral: false });
    const AyumiHata = await getEmoji('AyumiHata');
    const Ayumis = await getEmoji('AyumiMessage');

    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;

      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Ayumis}${AyumiHata} Remove komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.NoVoice}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue || !queue.songs.length) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.EmptyQueue}`));
      }

      if (!Number.isInteger(removeIndex) || removeIndex <= 0 || removeIndex > queue.songs.length) {
        return response.edit(bold(`${Ayumis}${AyumiHata} ${Cmd.InvalidIndex}`));
      }

      const removedSong = queue.songs[removeIndex - 1];
      queue.songs = queue.songs.filter((song, index) => index !== removeIndex - 1);
      PlayerHandler.Player.queues.collection.set(queue.id, queue);

      return response.edit(bold(`${Ayumis} ${Cmd.Success} Removed: ${removedSong.name}`));
    } catch (error) {
      console.error(error);
    }
  }
});
