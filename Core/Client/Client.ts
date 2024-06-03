import { Cartel, GatewayIntentBits } from "@Core";
import { Logger, Settings, EventHandler, CommandHandler, PresenceHandler, PlayerHandler, EmojiBuilder, Console } from '@Environment';
import mongoose from "mongoose";

export class Client extends Cartel {
    private static readonly Secret = new Settings().getSecret;
    private static readonly Database = new Settings().getDatabase.URL;
    private static Login = new Console().getLoginMessages;
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates
            ]
        });
    }

    public async Manager() {
        this.setMaxListeners(0);

        PlayerHandler.PlayerManager(this);
        Logger.warn(Client.Login.Music);

        await mongoose.connect(Client.Database);
        Logger.warn(Client.Login.Database);

        PresenceHandler.PresenceManager(this);
        Logger.warn(Client.Login.Presence);

        Logger.warn(Client.Login.Emojis);
        EmojiBuilder.SetClient(this);

        Logger.warn(Client.Login.Events);
        await EventHandler.EventManager(this);

        Logger.warn(Client.Login.Commands);
        await CommandHandler.CommandManager(this);

        this.login(Client.Secret);
    }
}