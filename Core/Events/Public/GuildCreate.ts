import { EventGen, Logger } from "@Environment";
import { Settings } from "@Database";

export default new EventGen({
    Category: "guildCreate",
    Execute(guild) {
        const defaultSettings = new Settings({
            guildId: guild.id,
            volume: 50, 
            autoplay: false 
          });

          defaultSettings.save()
            .then(() => Logger.info(`A new guild has been added to the database. Guild ID: ${guild.id}`))
            .catch(error => Logger.error(`Error saving settings for guild ${guild.id}: ${error}`));
    } 
})