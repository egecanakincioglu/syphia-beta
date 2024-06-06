import { readFileSync, load } from '@Environment';
import { ConsoleData } from '../@types/Console';

export class Console {
  private ConfigPath: string = './Config/Console.yml';
  private ConfigData: ConsoleData;

  constructor() {
    try {
      this.ConfigData = this.ConsoleLoader();
    } catch (Error) {
      console.error(Error);
    }
  }

  private ConsoleLoader() {
    return load(readFileSync(this.ConfigPath, { encoding: 'utf-8' })) as ConsoleData;
  }

  public get getLogger(): ConsoleData['Logger'] {
    return this.ConfigData.Logger;
  }

  public get getConsole(): ConsoleData['Console'] {
    return this.ConfigData.Console;
  }

  public get getEmojiSynchronization(): ConsoleData['EmojiSynchronization'] {
    return this.ConfigData.EmojiSynchronization;
  }

  public get getLoginMessages(): ConsoleData['LoginMessages'] {
    return this.ConfigData.LoginMessages;
  }
}
