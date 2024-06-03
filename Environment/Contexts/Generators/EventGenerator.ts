import { ClientEvents } from 'discord.js';

export class EventGen<Category extends keyof ClientEvents = keyof ClientEvents> {
    public Category: Category;
    public Execute: (...Cartel: ClientEvents[Category]) => unknown | Promise<unknown>;
    public Once = false;

    constructor(Options: EventGenOptions<Category>) {
        this.Execute = Options.Execute;
        this.Category = Options.Category;

        if (Options.Once) {
            this.Once = true;
        }
    }
}

interface EventGenOptions<Category extends keyof ClientEvents> {
    Execute(...Ayumi: ClientEvents[Category]): unknown | Promise<unknown>;
    Category: Category;
    Once?: boolean;
}