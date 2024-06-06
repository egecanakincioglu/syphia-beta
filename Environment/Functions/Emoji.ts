import { Client, GuildEmoji } from 'discord.js';
import mongoose, { Model } from 'mongoose';
import { Console, Logger, Settings } from '@Environment';
import { EmojiDocument, emojiSchema } from '@Database';

export class EmojiBuilder {
  private static client: Client;
  private static EmojiSystem = new Settings().getEmojiSystem;
  private static EmojiSynchronization = new Console().getEmojiSynchronization;

  public static SetClient(client: Client) {
    EmojiBuilder.client = client;
  }

  public static EmojiModel: Model<EmojiDocument> = mongoose.model('Emoji', emojiSchema) as Model<EmojiDocument>;

  public static async EmojiManager() {
    try {
      const serverId = this.EmojiSystem.TargetGuild;
      const guild = EmojiBuilder.client.guilds.cache.get(serverId);

      if (!guild) {
        Logger.error(this.EmojiSynchronization.NoGuild);
        return;
      }

      await EmojiBuilder.Emojis(guild);

      Logger.info(this.EmojiSynchronization.SyncComplete);
    } catch (error) {
      Logger.error(this.EmojiSynchronization.Error);
      console.error(error);
    }
  }

  private static async Emojis(guild: { emojis: { cache: Map<string, GuildEmoji> } }) {
    try {
      const emojis = Array.from(guild.emojis.cache.values());

      for (const emoji of emojis) {
        const existingEmoji = await EmojiBuilder.EmojiModel.findOne({ id: emoji.id });

        if (!existingEmoji) {
          const newEmoji = new EmojiBuilder.EmojiModel({
            id: emoji.id,
            name: emoji.name,
            full: `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`,
            link: emoji.url
          } as EmojiDocument);

          await newEmoji.save();
          Logger.info(`${this.EmojiSynchronization.Added} ${emoji.name}`);
        }
      }
    } catch (error) {
      Logger.error(this.EmojiSynchronization.Error);
      console.error(error);
    }
  }
}

export async function getEmoji(name: string): Promise<string | null> {
  try {
    const emoji = await EmojiBuilder.EmojiModel.findOne({ name });

    if (emoji) {
      return emoji.full;
    } else {
      return null;
    }
  } catch (error) {
    Logger.error(this.EmojiSynchronization.Error);
    console.error(error);
    return null;
  }
}

export async function getEmojiID(name: string): Promise<string | null> {
  try {
    const emoji = await EmojiBuilder.EmojiModel.findOne({ name });

    if (emoji) {
      return emoji.id;
    } else {
      return null;
    }
  } catch (error) {
    Logger.error(this.EmojiSynchronization.Error);
    console.error(error);
    return null;
  }
}

export async function getEmojiLink(name: string): Promise<string | null> {
  try {
    const emoji = await EmojiBuilder.EmojiModel.findOne({ name });

    if (emoji) {
      return emoji.link;
    } else {
      return null;
    }
  } catch (error) {
    Logger.error(this.EmojiSynchronization.Error);
    console.error(error);
    return null;
  }
}
