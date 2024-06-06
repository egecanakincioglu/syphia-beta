import { EventGen, PresenceHandler, Logger, Settings, EmojiBuilder } from '@Environment';
import { getGuildSizes } from 'Environment/Functions/Client';

export default new EventGen({
  Category: 'ready',
  Once: true,
  async Execute(client) {
    client.user.setPresence({ activities: [{ name: '🫥 Syphia Music starting...' }] });
    await EmojiBuilder.EmojiManager();

    function presenceListener() {
      PresenceHandler.LoadPresence();
      client.removeListener('startPresence', presenceListener);
    }

    client.on('startPresence', presenceListener);

    const settings = new Settings();
    const servers = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((total, current) => total + current.memberCount, 0);
    const shards = client.shard.ids;

    Logger.info(`Bot ${shards.join(', ')} shardından aktif! Shardım ${servers} sunucu ve ${users} kullanıcıya hizmet ediyorum!`);

    if (shards.includes(settings.getDeveloper.TotalShards - 1)) {
      const { users, servers } = await getGuildSizes(client);
      Logger.info(`Tüm shardlar aktif! Toplamda ${servers} sunucu ve ${users} kullanıcıya hizmet ediyorum!`);
      client.shard.broadcastEval((cl) => cl.emit('startPresence'));
    }
  }
});
