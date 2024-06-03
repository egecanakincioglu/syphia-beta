import { readFileSync, load, Logger } from "@Environment";
import { StringsData } from "../@types/Strings";

export class Strings {
    private ConfigPath: string = "./Config/Strings.yml"
    private ConfigData: StringsData

    constructor() {
        try {
            this.ConfigData = this.StringsLoader();
        } catch (Error) {
            Logger.error(`An error occurred:`);
            console.error(Error);
        }
    }

    private StringsLoader() {
        return load(
            readFileSync(this.ConfigPath, { encoding: "utf-8" })
        ) as StringsData
    }

    public get getUnicodeEmojis(): StringsData["UnicodeEmojis"] {
        return this.ConfigData.UnicodeEmojis;
    }

    public get getPresence(): StringsData["Presence"] {
        return this.ConfigData.Presence;
    }

    public get getGeneral(): StringsData["General"] {
        return this.ConfigData.General;
    }

    public get getAutoplay(): StringsData["Autoplay"] {
        return this.ConfigData.Autoplay;
    }

    public get getForward(): StringsData["Forward"] {
        return this.ConfigData.Forward;
    }

    public get getJoin(): StringsData["Join"] {
        return this.ConfigData.Join;
    }

    public get getLeave(): StringsData["Leave"] {
        return this.ConfigData.Leave;
    }

    public get getLoop(): StringsData["Loop"] {
        return this.ConfigData.Loop;
    }

    public get getPause(): StringsData["Pause"] {
        return this.ConfigData.Pause;
    }

    public get getPlay(): StringsData["Play"] {
        return this.ConfigData.Play;
    }

    public get getResume(): StringsData["Resume"] {
        return this.ConfigData.Resume;
    }

    public get getRewind(): StringsData["Rewind"] {
        return this.ConfigData.Rewind;
    }

    public get getSkip(): StringsData["Skip"] {
        return this.ConfigData.Skip;
    }

    public get getStop(): StringsData["Stop"] {
        return this.ConfigData.Stop;
    }

    public get getVolume(): StringsData["Volume"] {
        return this.ConfigData.Volume;
    }

    public get getPing(): StringsData["Ping"] {
        return this.ConfigData.Ping;
    }

    public get getQueue(): StringsData["Queue"] {
        return this.ConfigData.Queue;
    }

    public get getFilter(): StringsData["Filter"] {
        return this.ConfigData.Filter;
    }

    public get getSkipTo(): StringsData["SkipTo"] {
        return this.ConfigData.SkipTo;
    }

    public get getRemove(): StringsData["Remove"] {
        return this.ConfigData.Remove;
    }

    public get getSeek(): StringsData["Seek"] {
        return this.ConfigData.Seek;
    }

    public get getShuffle(): StringsData["Shuffle"] {
        return this.ConfigData.Shuffle;
    }

    public get getPlayNow(): StringsData["PlayNow"] {
        return this.ConfigData.PlayNow;
    }
}