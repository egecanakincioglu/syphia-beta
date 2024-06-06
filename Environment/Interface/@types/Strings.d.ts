import { Queue } from 'distube';

export interface StringsData {
  UnicodeEmojis: {
    Error: string;
    Thinking: string;
    Searching: string;
    ThumbsUp: string;
    Page: string;
    Musical: string;
    Radio: string;
    SongLenght: string;
    Warn: string;
    Leave: string;
    Denied: string;
    Award: string;
    CheckMark: string;
    Decorator: string;
    Info: string;
    Ping: string;
    Settings: string;
  };

  Presence: {
    Guilds: string;
    Users: string;
  };

  General: {
    NoChannel: string;
    NoSong: string;
    NoPlaying: string;
    NoBotchannel: string;
    NoQueue: string;
    StageNotAllowed: string;
    DifferentChannel: string;
    NoPause: string;
  };

  Autoplay: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
      On: string;
      Off: string;
    };
    Title: string;
    Messages: string[];
    Footer: string;
    Invalid: string;
    Error: string;
    Status: {
      Enabled: string;
      Disabled: string;
    };
  };

  Forward: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    InvalidTime: string;
    Response: string[];
  };

  Join: {
    Description: string;
    AlreadyPlaying: string;
    Joined: string[];
    AlreadyJoined: string;
    AlreadyWithYou: string;
  };

  Leave: {
    Description: string;
    OnlyWithBot: string;
    Leaved: string[];
  };

  Loop: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
      Track: string;
      Queue: string;
      Disable: string;
    };
    LoopString: {
      Enabled: string;
      Disabled: string;
    };
    LoopDisabled: string;
    InavlidMode: string;
    TrackLoop: string;
    QueueLoop: string;
  };

  Pause: {
    Description: string;
    Paused: string;
  };

  Play: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    Joinable: string;
    Speakable: string;
  };

  Resume: {
    Description: string;
    AlreadyPlaying: string;
    Resumed: string;
  };

  Rewind: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    InvalidTime: string;
    Rewinded: string[];
  };

  Skip: {
    Description: string;
    Skipped: string;
  };

  Stop: {
    Description: string;
    Stopped: string;
  };

  Volume: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    InvalidVolume: string;
    VolumeSet: string[];
    AvaibleVolume: string;
  };

  Ping: {
    Description: string;
    ButtonLabel: string;
    Footer: string;
    ClientPing: string[];
    Completed: string;
    Timeout: string;
    Title: string;
    Messages: string[];
  };

  Queue: {
    Description: string;
    EmptyQueue: string;
  };

  Filter: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    FilterEnabled: string;
    FilterDeleted: string;
    FilterDisabled: string;
    InvalidFilter: string;
  };

  SkipTo: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    EmptyQueue: string;
    InvalidIndex: string;
    Success: string;
    CurrentSong: string;
  };

  Remove: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    EmptyQueue: string;
    InvalidIndex: string;
    Success: string;
  };

  Seek: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    InvalidTime: string;
    Success: string;
  };

  Shuffle: {
    Description: string;
    ShuffleEnabled: string;
  };

  PlayNow: {
    Description: string;
    Options: {
      Name: string;
      Description: string;
    };
    Joinable: string;
    Speakable: string;
    Success: string;
  };
}
