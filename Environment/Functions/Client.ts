import { Client } from "discord.js";

export async function getGuildSizes(client: Client) {
  return (await client.shard.broadcastEval((Cartel) => ({
      users: Cartel.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0),
      servers: Cartel.guilds.cache.size,
    })
  )).reduce((total, data) => ({
    users: total.users + data.users,
    servers: total.servers + data.servers
  }), { users: 0, servers: 0 });
}