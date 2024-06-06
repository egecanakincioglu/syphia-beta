import { getEmoji, getEmojiLink, Strings } from '@Environment';
import { EmbedBuilder } from 'discord.js';

export class AutoplayInterface {
  public static AutoplayEmbed = new EmbedBuilder();

  public static async ReplaceAutoplay() {
    const Cmd = new Strings().getAutoplay;
    const SyphiaDecorate = await getEmoji('SyphiaDecorate');
    const SyphiaMessage = await getEmoji('SyphiaMessage');

    this.AutoplayEmbed = new EmbedBuilder();

    const DescriptionMessages: string[] = [`${SyphiaDecorate} ${Cmd.Messages[0]}`, `${SyphiaMessage} ${Cmd.Messages[1]}`];

    return {
      AutoplayEmbed: this.AutoplayEmbed.setAuthor({ name: Cmd.Title, iconURL: await getEmojiLink('SyphiaStar') }).setDescription(DescriptionMessages.join('\n\n')),
      AutoplayDescription: DescriptionMessages,
      SyphiaMessage: SyphiaMessage
    };
  }
}
