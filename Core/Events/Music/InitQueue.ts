import { MusicEventGen, PlayerHandler } from '@Environment';
import { Playlist, Queue } from 'distube';
import { AddList } from '@Core';
import { createTimeout } from 'Environment/Functions/Util';

export default new MusicEventGen({
  Category: 'initQueue',
  async Execute(oldQueue: Queue) {
    const queue = PlayerHandler.Player.getQueue(oldQueue);
    const song = queue.songs[0];
    const playlist = song.playlist;

    if (!song.playlist) return;

    async function checkForPlay() {
      const queue = PlayerHandler.Player.getQueue(oldQueue.id);

      if (!queue) return;

      const playlistSongs = queue.songs.filter((song) => song.playlist?.name === playlist.name);

      if (playlistSongs.length < 2) {
        await createTimeout(1750);
        return checkForPlay();
      }

      const newPlaylist = new Playlist(playlistSongs, {
        member: playlist.member,
        metadata: playlist.metadata,
        properties: {
          name: playlist.name,
          url: playlist.url
        }
      });

      const { AddListEmbed } = AddList.ReplaceSongEvent(newPlaylist, queue);
      return queue.textChannel.send({ embeds: [AddListEmbed] });
    }

    checkForPlay();
  }
});
