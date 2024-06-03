import { GuildMember, SlashCommandBuilder, bold } from 'discord.js';
import { AutoplayInterface, CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';

const Cmd = new Strings().getAutoplay;
const Auto = new Strings().getGeneral;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription(Cmd.Description)
    .addStringOption(option =>
      option.setName(Cmd.Options.Name)
        .setDescription(Cmd.Options.Description)
        .setRequired(true)
        .addChoices(
          { name: Cmd.Options.On, value: 'on'},
          { name: Cmd.Options.Off, value: 'off'}
        )),
        Execute: async (interaction) => {
          const Response = await interaction.deferReply({ ephemeral: false });
          const Hata = await getEmoji('SyphiaHata');
          const Mesaj = await getEmoji('SyphiaMessage');

          const { AutoplayEmbed, AutoplayDescription, SyphiaMessage } = await AutoplayInterface.ReplaceAutoplay();
        
          try {
            const member = interaction.member as GuildMember;
            const queue = PlayerHandler.Player.getQueue(interaction.guildId);

            if (!queue) {
              return Response.edit(bold(`${Mesaj}${Hata} ${Auto.NoQueue}`));
            }

            const voiceChannel = member.voice.channel;
            const botVoiceChannel = interaction.guild.members.me?.voice?.channel;
      
            if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
              return Response.edit(bold(`${Mesaj}${Hata} Autoplay komutunu k ullanabilmek için bot ile aynı kanalda olmalısınız!`));
            }
            
            const guildId = interaction.guildId;
            const autoplayStatus = interaction.options.getString(Cmd.Options.Name);
            const Messages: string[] = [...AutoplayDescription, `${SyphiaMessage} **${Cmd.Messages[2]} \`${autoplayStatus === 'on' ? Cmd.Status.Enabled : Cmd.Status.Disabled}\`.**`] 
            const NewAutoplayEmbed = AutoplayEmbed
              .setThumbnail(interaction.guild.iconURL())
              .setDescription(Messages.join("\n\n"))
              .setFooter({ text: `${interaction.user.displayName} ${Cmd.Footer}`, iconURL: interaction.user.avatarURL() })

            if (autoplayStatus === 'on') {
              PlayerHandler.Player.toggleAutoplay(guildId);
            } else if (autoplayStatus === 'off') {
              PlayerHandler.Player.toggleAutoplay(guildId);
            } else {
              return Response.edit(bold(`${Mesaj}${Hata} ${Cmd.Invalid}`));
            }
        
            return Response.edit({ embeds: [NewAutoplayEmbed] });
        
          } catch (error) {
            console.error(error);
            return Response.edit(bold(Cmd.Error));
          }
        },
});
