import { EventGen, CommandHandler } from '@Environment';

export default new EventGen({
  Category: 'interactionCreate',
  Execute(Interaction) {
    if (!Interaction.isChatInputCommand()) return;

    const CartelCommand = CommandHandler.getCommands().find((Cartel) => Cartel.SlashCommandGen.name === Interaction.command.name);

    if (CartelCommand) return CartelCommand.Execute(Interaction);
  }
});
