import { Time, Console } from '@Environment';

export class Logger {
  private static Log = new Console().getLogger;

  public static info(Syphia: string): void {
    Logger.log(this.Log.Info, Syphia);
  }

  public static warn(Syphia: string): void {
    Logger.log(this.Log.Warn, Syphia);
  }

  public static error(Syphia: string): void {
    Logger.log(this.Log.Error, Syphia);
  }

  private static log(LogType: string, SyphiaLog: string): void {
    const setTime = Time.instant();
    const botName = new Console().getConsole.Prefix;
    let logMessage: string;

    switch (LogType) {
      case this.Log.Info:
        logMessage = `[${setTime}] [${botName}] [${this.Log.Info}] ${SyphiaLog}`;
        break;

      case this.Log.Warn:
        logMessage = `[${setTime}] [${botName}] [${this.Log.Warn}] ${SyphiaLog}`;
        break;

      case this.Log.Error:
        logMessage = `[${setTime}] [${botName}] [${this.Log.Error}] ${SyphiaLog}`;
        break;

      default:
        logMessage = `[${setTime}] [${botName}] [${LogType}] ${SyphiaLog}`;
        break;
    }

    console.log(logMessage);
  }
}
