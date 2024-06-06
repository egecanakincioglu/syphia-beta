import { StatusTypes } from './Presence';

export interface SettingsData {
  Developer: {
    Name: string;
    ID: string;
    TotalShards: number;
  };

  Secret: string;

  Signature: string;

  Presence: {
    Status: StatusTypes;
    Message: string[];
  };

  EmojiSystem: {
    TargetGuild: string;
  };

  Database: {
    URL: string;
  };
}
