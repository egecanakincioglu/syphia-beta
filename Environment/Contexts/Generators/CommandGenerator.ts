import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export class CommandGen {
    public Execute: CommandGenOptions["Execute"];

    public SlashCommandGen: CommandGenOptions["SlashCommandGen"];

    constructor(Options: CommandGenOptions) {
        this.Execute = Options.Execute;
        this.SlashCommandGen = Options.SlashCommandGen;
    }
}

type SlashCommandBuilders = Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> |
    SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandsOnlyBuilder

interface CommandGenOptions {
    Execute(Interaction: ChatInputCommandInteraction): unknown | Promise<unknown>;
    SlashCommandGen: SlashCommandBuilders
}