import { Client } from "@Core";
import { Logger } from "@Environment";

export class Klaus {
    constructor() {
        const Klaus = new Client();
        Klaus.Manager();

        process.on('unhandledRejection', (error: Error) => {
            Logger.error(`${error.name}:`);
            console.error(error);
        });

        process.on('uncaughtException', (error: Error) => {
            Logger.error(`${error.name}:`);
            console.error(error);
        });
    }
}

new Klaus();