import { Client, readdir, EventGen, join, Time, Logger, PlayerHandler } from "@Environment";
import { MusicEventGen } from "../Generators/MusicEventGenerator";

export class EventHandler {
    private static Events: EventGen[] = [];
    private static MusicEvents: MusicEventGen[] = [];

    private static Path = "./Core/Events";
    private static PublicCategory = "Public";
    private static MusicCategory = "Music";

    private static async Loader() {
        const Path = join(process.cwd(), this.Path);
        
        const GrantedEvents: EventGen[] = [];
        const MusicEvents: MusicEventGen[] = [];

        const loadEventCategory = async <EventClass>(eventArray: EventClass[], eventClass: new (...args: unknown[]) => EventClass, category: string) => {
            const folder = join(Path, category);
            const FileOfCartel = (await readdir(folder)).filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"));

            for (const CartelFile of FileOfCartel) {
                try {
                    const CartelEvents = (await import(`file://${join(folder, CartelFile)}`))

                    if (!CartelEvents || !("default" in CartelEvents) || !(CartelEvents.default instanceof eventClass)) {
                        Logger.info(`[Event Loader] ${CartelFile} has missing data.`);
                        continue;
                      }

                    eventArray.push(CartelEvents.default);
                    Logger.info(`[Event Loader] (${category}) ${CartelFile} loaded successfully.`);
                } catch (Ayumi) {
                    Logger.error(`Bir hata meydana geldi:`);
                    console.error(Ayumi);
                }
            }
        }

        await loadEventCategory(GrantedEvents, EventGen, this.PublicCategory);
        await loadEventCategory(MusicEvents, MusicEventGen, this.MusicCategory);
        
        this.Events = GrantedEvents;
        this.MusicEvents = MusicEvents
    }

    private static setEvents(client: Client) {
        for (const MainEvent of this.Events) {
            const Register = (MainEvent.Once ? client.once : client.on).bind(client);
            Register(MainEvent.Category, (...Ayumi: any) => void MainEvent.Execute(...Ayumi));
        }

        for (const MusicEvent of this.MusicEvents) {
            const Register = (MusicEvent.Once ? PlayerHandler.Player.once : PlayerHandler.Player.on).bind(PlayerHandler.Player);
            Register(MusicEvent.Category, (...Ayumi: any) => void MusicEvent.Execute(...Ayumi));
        }
    }

    public static async EventManager(client: Client) {
        await this.Loader();
        this.setEvents(client);
    }

    public static getEvents() {
        return this.Events;
    }
}