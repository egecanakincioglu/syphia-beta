import { Client } from "@Core";
import { Settings, Strings } from "@Environment";
import { ActivityType, PresenceStatus } from "discord.js";
import { getGuildSizes } from "Environment/Functions/Client";


export class PresenceHandler {
    private static client: Client;

    static PresenceManager(client: Client): void {
        PresenceHandler.client = client;
    }

    private static async AyumiPresence(message: string) {
        const StatusType = new Settings().getPresence.Status;
        const { users, servers } = await getGuildSizes(this.client);
        PresenceHandler.client.user.setPresence({
            activities: [
                {
                    name: message.replace("{users}", users.toString()).replace("{servers}", servers.toString()),
                    type: ActivityType.Listening
                }
            ],
            status: StatusType
        });
    }

    public static async LoadPresence() {
        const Presence = new Strings().getPresence;
        let PresenceQueue = 0;

        const usePresence = async () => {
            const PresenceMessages = new Settings().getPresence.Message;
            const startMessage = `🌀 {servers} ${Presence.Guilds} | {users} ${Presence.Users}`;
            const AyumiMessages: string[] = [startMessage, ...PresenceMessages];
            const MainMessage = AyumiMessages[PresenceQueue];
            await this.AyumiPresence(MainMessage);
            PresenceQueue = (PresenceQueue + 1) % AyumiMessages.length;
        }

        await usePresence();
        setInterval(usePresence, 8000);
    }
}