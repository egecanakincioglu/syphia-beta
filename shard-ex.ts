import { ShardingManager } from 'discord.js';
import { Settings, Logger } from '@Environment';

class Sharding {
  private static settings = new Settings();
  private static readonly Token = this.settings.getSecret;
  private SystemManager: ShardingManager;

  constructor() {
    this.SystemManager = new ShardingManager('./Core/Syphia.ts', {
      token: Sharding.Token,
      totalShards: Sharding.settings.getDeveloper.TotalShards,
      mode: "process",
      respawn: true,
      execArgv: ["--import", "tsx"]
    });
    this.setupEvents();
  }

  private setupEvents(): void {
    this.SystemManager.on('shardCreate', (shard) => {
      Logger.warn(`[Sharding Manager] Shard ${shard.id} started.`);
    });
  
    this.SystemManager.spawn();
  }
}

new Sharding();
