import { ButtonInteraction, ChatInputCommandInteraction, Client, InteractionResponse } from 'discord.js';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { DeezerPlugin } from '@distube/deezer';

export class PlayerHandler {
  private static client: Client;
  public static Player: DisTube;
  public static interactionMap = new Map<string, InteractionResponse | ChatInputCommandInteraction | ButtonInteraction>();
  public static Plugins = [new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin(), new YtDlpPlugin(), new DeezerPlugin()];

  public static PlayerManager(client: Client): void {
    PlayerHandler.client = client;
    PlayerHandler.Player = new DisTube(PlayerHandler.client, {
      leaveOnStop: false,
      leaveOnEmpty: true,
      emptyCooldown: 300,
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emitAddListWhenCreatingQueue: false,
      plugins: this.Plugins
    });
  }
}
