import { readFileSync, load, Logger } from "@Environment";
import { SettingsData } from "../@types/Settings";

export class Settings {
    private ConfigPath: string = "./Config/Settings.yml";
    private ConfigData: SettingsData;

    constructor() {
        try {
            this.ConfigData = this.SettingsLoader();
        } catch (Error) {
            Logger.error(`An error occurred:`);
            console.error(Error);
        }
    }

    private SettingsLoader() {
        return load(
            readFileSync(this.ConfigPath, { encoding: "utf-8" })
        ) as SettingsData
    }

    public get getDeveloper(): SettingsData["Developer"] {
        return this.ConfigData.Developer;
    }

    public get getSecret(): SettingsData["Secret"] {
        return this.ConfigData.Secret;
    }

    public get getSignature(): SettingsData["Signature"] {
        return this.ConfigData.Signature;
    }

    public get getPresence(): SettingsData["Presence"] {
        return this.ConfigData.Presence;
    }

    public get getEmojiSystem(): SettingsData["EmojiSystem"] {
        return this.ConfigData.EmojiSystem;
    }

    public get getDatabase(): SettingsData["Database"] {
        return this.ConfigData.Database;
    }
}

