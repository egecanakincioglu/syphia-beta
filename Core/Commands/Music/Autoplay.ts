import { GuildMember, SlashCommandBuilder, bold } from 'discord.js';
import { AutoplayInterface, CommandGen, Logger, PlayerHandler, Strings, StatementBuilder } from '@Environment';

const Command = new Strings().getAutoplay;
const General = new Strings().getGeneral;
const Emojis = new Strings().getUnicodeEmojis;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder().setName('autoplay2').setDescription(Command.Description),
  Execute: async (interaction) => {
    const Response = await interaction.deferReply({ ephemeral: true });
    const { AutoplayEmbed, AutoplayDescription } = await AutoplayInterface.ReplaceAutoplay();

    try {
      const Member = interaction.member as GuildMember;
      const Queue = PlayerHandler.Player.getQueue(interaction.guildId);

      const UserChannel = Member.voice.channel;
      const RiaChannel = interaction.guild.members.me?.voice?.channel;

      const ErrorHandler = new StatementBuilder().addNullishStatement(Member.voice.channel, `${Emojis.Error} ${General.NoChannel}`, (Channel, ErrorHandler) =>
        ErrorHandler.addNormalStatement(Channel, bold(`${Emojis.Error} ${General.NoQueue}`), (Input) => !Queue).addNormalStatement(
          Channel,
          bold(`${Emojis.Error} ${General.DifferentChannel}`),
          (Input) => {
            return RiaChannel ? RiaChannel.id === Input.id : true;
          }
        )
      );
    } catch (Error) {
      Logger.error('Bir Hata Meydana Geldi:');
      console.error(Error);
    }
  }
});
