import { Client, readdir, CommandGen, join, Logger } from '@Environment';
import { SlashCommandBuilder } from 'discord.js';

export class CommandHandler {
  private static Commands: CommandGen[] = [];
  private static Path = './Core/Commands';

  private static async Reader(Path = join(process.cwd(), this.Path)) {
    const FileOfCartel = await readdir(Path, { withFileTypes: true });
    const GrantedCommands: CommandGen[] = [];

    for (const CartelFile of FileOfCartel) {
      try {
        if (CartelFile.isDirectory()) {
          const DirectoryCommands = await this.Reader(join(Path, CartelFile.name));
          GrantedCommands.push(...DirectoryCommands);
          continue;
        }

        const CartelCommands = await import(`file://${Path}/${CartelFile.name}`);

        if (!CartelCommands || !('default' in CartelCommands) || !(CartelCommands.default instanceof CommandGen)) {
          Logger.info(`[Command Loader] ${CartelFile.name} has missing data.`);
          continue;
        }

        GrantedCommands.push(CartelCommands.default);
        Logger.info(`[Command Loader] ${CartelFile.name} loaded successfully`);
      } catch (Ayumi) {
        Logger.error(`Bir hata meydana geldi:`);
        console.error(Ayumi);
      }
    }
    return GrantedCommands;
  }

  private static async Loader() {
    this.Commands = await this.Reader();
  }

  private static async setCommands(client: Client) {
    const Data = this.Commands.map((CommandSender) => CommandSender.SlashCommandGen as SlashCommandBuilder);
    const API = client.application;

    if (!API) return Logger.error(`API Bağlantısı kurulamadı, lütfen botu yeniden başlatın.`);
    await API.commands.set(Data);
  }

  public static async CommandManager(client: Client) {
    await this.Loader();
    client.once('ready', async (Cartel) => {
      await this.setCommands(Cartel);
    });
  }

  public static getCommands() {
    return this.Commands;
  }
}
