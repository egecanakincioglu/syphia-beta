import { MusicEventGen } from '@Environment';
import { Message } from 'discord.js';

export default new MusicEventGen({
  Category: 'searchNoResult',
  Execute(message: Message<true>, query: string) {
    message.channel.send(`:negative_squared_cross_mark: | No result found for \`${query}\`!`);
    console.error('channel is not defined for the message:', message);
  }
});
