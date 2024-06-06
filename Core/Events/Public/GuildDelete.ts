import { EventGen, Logger } from '@Environment';
import { Settings } from '@Database';

export default new EventGen({
  Category: 'guildDelete',
  Execute(guild) {
    Settings.findOneAndDelete({ guildId: guild.id })
      .then(() => Logger.info(`Guild data has been removed from the database. Guild ID: ${guild.id}`))
      .catch((error) => Logger.error(`Error deleting settings for guild ${guild.id}: ${error}`));
  }
});
