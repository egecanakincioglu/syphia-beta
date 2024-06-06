import { Settings } from '@Database';
import { PlayerHandler } from '@Environment';

export class PrivateGuildSettings {
  private hasRun: boolean = false;

  private async applyVolumesToGuilds() {
    try {
      const allGuildSettings = await Settings.find({});

      allGuildSettings.forEach(async (guildSettings) => {
        const guildId = guildSettings.guildId;
        const volumeLevel = guildSettings.volume;

        if (PlayerHandler.Player.getQueue(guildId) && volumeLevel >= 0 && volumeLevel <= 100) {
          PlayerHandler.Player.setVolume(guildId, volumeLevel);
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      console.error('Error applying volumes to guilds:', error);
    }
  }

  public async setAllSettings() {
    if (!this.hasRun) {
      await this.applyVolumesToGuilds();
      this.hasRun = true;
    } else {
      console.log('Settings have already been applied. Skipping...');
    }
  }
}

// KULLANIMDA BU OLACAK

// import { Settings } from '@Database';
// import { PlayerHandler } from '@Environment';
// import { QueueManager } from 'distube';

// export class PrivateGuildSettings {

//   private async applyVolumesToGuilds() {
//     try {
//       const queues: QueueManager = PlayerHandler.Player.queues;
//       const entries = Object.entries(queues);

//       for (const [guildId, queue] of entries) {
//         const guildSettings = await Settings.findOne({ guildId });

//         if (guildSettings) {
//           const volumeLevel = guildSettings.volume;

//           if (volumeLevel >= 0 && volumeLevel <= 100) {
//             queue.setVolume(volumeLevel);
//             console.log(`Ses sunucu için ayarlandı ${guildId}: ${volumeLevel}`);
//           } else {
//             console.log(`Geçersiz ses: ${guildId}`);
//           }
//         } else {
//           console.log(`Sunucu için ses ayarı bulunamadı: ${guildId}`);
//         }
//       }

//     } catch (error) {
//       console.error('Ses ayarlama sırasında bir hata meydana geldi:', error);
//     }
//   }

//   public async setAllSettings() {
//     await this.applyVolumesToGuilds();
//   }
// }

// KULLANIMDA BU OLACAK
