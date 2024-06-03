import { EmbedBuilder, bold } from "discord.js";
import { Strings } from "@Environment";

export class PingInterface {
    public static PingEmbed = new EmbedBuilder();
    
    public static async ReplacePing() {
        const Cmd = new Strings().getPing;
        const Emojis = new Strings().getUnicodeEmojis

        this.PingEmbed = new EmbedBuilder();

        const DescriptionMessages: string[] = [
            `${Emojis.Info} ${Cmd.Messages[0]}`,
            `${Emojis.Decorator} ${Cmd.Messages[1]}`
        ];

        return {
            PingEmbed: this.PingEmbed
                .setTitle(Cmd.Title)
                .setDescription(bold(DescriptionMessages.join("\n\n"))),
            PingDescription: DescriptionMessages
        }
    }
}