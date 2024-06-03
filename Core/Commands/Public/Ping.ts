import { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, bold } from "discord.js";
import { CommandGen, PingInterface, Strings, getEmoji } from "@Environment";

const Cmd = new Strings().getPing;

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(Cmd.Description),
  Execute: async (interaction: ChatInputCommandInteraction) => {
    const AyumiPing = await getEmoji('AyumiPing');
    const KlausTimeout = await getEmoji('KlausTimeout');

    const startTimestamp = Date.now();
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('ping_button')
        .setLabel(Cmd.ButtonLabel)
        .setStyle(ButtonStyle.Primary),
    );

    const { PingEmbed, PingDescription } = await PingInterface.ReplacePing();
    const NewPingEmbed = PingEmbed
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.user.displayName} ${Cmd.Footer}`, iconURL: interaction.user.avatarURL() })

    await interaction.reply({ embeds: [NewPingEmbed], components: [row], ephemeral: false });

    const pingButtonCollector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000,
    });

    let finished = false;

    pingButtonCollector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'ping_button') {
        const endTimestamp = Date.now();
        const ping = endTimestamp - startTimestamp;
        const Messages: string[] = [...PingDescription, `${AyumiPing} **${Cmd.ClientPing[0]} ${ping} ${Cmd.ClientPing[1]}**`]
        const Ping = NewPingEmbed.setDescription(Messages.join("\n\n"))
        const data = {
          content: bold(Cmd.Completed),
          embeds: [Ping],
          components: [row],
          ephemeral: false
        }
        row.components[0].setDisabled(true);
        buttonInteraction.deferUpdate()
        await interaction.editReply(data);
        finished = true
        pingButtonCollector.stop();
      }
    });

    pingButtonCollector.on('end', () => {
      if (finished) return

      row.components[0].setDisabled(true);
      const data = {
        content: bold(`${KlausTimeout} ${Cmd.Timeout}`),
        components: [row],
        ephemeral: false
      }
      interaction.replied ? interaction.editReply(data) : interaction.reply(data);
    });
  },
});