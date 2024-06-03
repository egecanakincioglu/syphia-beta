import { Events, DisTubeEvents } from 'distube';

export class MusicEventGen<Event extends keyof DisTubeEvents = keyof DisTubeEvents> {
    public Category: Event;
    public Execute: (...Ayumi: DisTubeEvents[Event]) => unknown | Promise<unknown>;
    public Once = false;

    constructor(Options: EventGenOptions<Event>) {
        this.Execute = Options.Execute;
        this.Category = Options.Category;

        if (Options.Once) {
            this.Once = true;
        }
    }
}

interface EventGenOptions<Event extends keyof DisTubeEvents> {
    Execute(...Ayumi: DisTubeEvents[Event]): unknown | Promise<unknown>;
    Category: Event;
    Once?: boolean;
}