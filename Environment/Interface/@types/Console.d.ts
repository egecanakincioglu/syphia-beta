export interface ConsoleData {
  Logger: {
    Info: string;
    Warn: string;
    Error: string;
  };

  Console: {
    Prefix: string;
  };

  EmojiSynchronization: {
    NoGuild: string;
    SyncComplete: string;
    Error: string;
    Added: string;
  };

  LoginMessages: {
    Music: string;
    Database: string;
    Presence: string;
    Emojis: string;
    Events: string;
    Commands: string;
  };
}
