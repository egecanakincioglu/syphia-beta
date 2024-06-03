import { SlashCommandBuilder, GuildMember, bold, APIApplicationCommandOptionChoice } from 'discord.js';
import { CommandGen, PlayerHandler, Strings, getEmoji } from '@Environment';
import { Queue, defaultFilters } from 'distube';

const Cmd = new Strings().getFilter;
const General = new Strings().getGeneral;
const Emojis = new Strings().getUnicodeEmojis;
const filterObject = {
  "3D": "3d",
  "Bass Boost": "bassboost",
  "Echo": "echo",
  "Karaoke": "karaoke",
  "Nightcore": "nightcore",
  "Vaporwave": "vaporwave",
  "Flanger": "flanger",
  "Gate": "gate",
  "Haas": "haas",
  "Reverse": "reverse",
  "Surround": "surround",
  "Mcompand": "mcompand",
  "Phaser": "phaser",
  "Tremolo": "tremolo",
  "Earwax": "earwax",
  "Off": "off"
}
const filters = Object.values(filterObject);
const commandValues = Object.entries(filterObject).map(([name, value]) => ({ name, value }));

export default new CommandGen({
  SlashCommandGen: new SlashCommandBuilder()
    .setName('filter')
    .setDescription(Cmd.Description)
    .addStringOption(option =>
      option.setName(Cmd.Options.Name)
        .setDescription(Cmd.Options.Description)
        .setRequired(true)
        .addChoices(...commandValues)
    ),
  Execute: async (interaction) => {
    const response = await interaction.deferReply({ ephemeral: false });
    const Reply = await getEmoji('SyphiaReply');


    try {
      const member = interaction.member as GuildMember;

      const voiceChannel = member.voice.channel;
      const botVoiceChannel = interaction.guild.members.me?.voice?.channel;
      
      if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
        return response.edit(bold(`${Reply}${Emojis.Error} Filter komutunu kullanabilmek için bot ile aynı kanalda olmalısınız!`));
      }

      if (!member || !member.voice?.channel) {
        return response.edit(bold(`${Reply}${Emojis.Error} ${General.NoChannel}`));
      }

      const queue = PlayerHandler.Player.getQueue(interaction.guildId);

      if (!queue) {
        return response.edit(bold(`${Reply}${Emojis.Error} ${General.NoSong}`));
      }

      const filterType = interaction.options.getString(Cmd.Options.Name);

      if (!filters.includes(filterType)) {
        return response.edit(bold(`${Reply}${Emojis.Settings} ${Cmd.InvalidFilter}`));
      }

      const result = applyFilter(queue, filterType);
      const message = result === 0 ? Cmd.FilterDisabled : 
        `${result === -1 ? Cmd.FilterDeleted : Cmd.FilterEnabled} ${Object.entries(filterObject).find(([, value]) => value === filterType)[0]}`;

      return response.edit(bold(`${Reply}${Emojis.Settings} ${message}`));
    } catch (error) {
      console.error(error);
    }
  },
});

function applyFilter(queue: Queue, filterType) {
  if (filterType === "off") {
    queue.filters.clear();
    return 0;
  }

  if (queue.filters.has(filterType)) {
    queue.filters.remove(filterType);
    return -1;
  }

  queue.filters.add(filterType);
  return 1;
}
