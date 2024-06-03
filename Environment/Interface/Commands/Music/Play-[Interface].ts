import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, bold } from 'discord.js';
import { Queue, Song } from "distube";
import { PlayerHandler, getEmoji } from "@Environment";
import { createTimeout } from "Environment/Functions/Util";
import { PrivateGuildSettings } from "@Database";

export class PlayerInterface {
  public static PlaySongEmbed = new EmbedBuilder();

  public static async ReplaceSongEvent(song: Song, queue: Queue) {
    const privateGuildSettings = new PrivateGuildSettings();
    await privateGuildSettings.setAllSettings();
    await createTimeout(50);
  
    const songEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Now Playing",
        iconURL: `https://cdn.discordapp.com/emojis/1204887203965182042.png`
      })
      .setThumbnail(song.user.avatarURL())
      .setColor('#1ab0a0')
      .setImage(song.thumbnail)
      .setFields(
        { name: "Track:", value: `**[${song.name}](${song.url})**`, inline: false },
        { name: "Requested by:", value: `${song.member}`, inline: true },
        { name: "Track Duration:", value: `\`${song.formattedDuration}\``, inline: true },
        { name: "Loudness:", value: `\`${queue.volume}%\``, inline: true },
        { name: "Audio Filter:", value: `\`${queue.filters.names.join(', ') || 'Disable'}\``, inline: true },
        { name: "Loop Mode:", value: `\`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Queue' : 'Songs') : 'Disable'}\``, inline: true },
        { name: "Autoplay:", value: `\`${queue.autoplay ? 'Enabled' : 'Disable'}\``, inline: true },
      )  
      .setFooter({
        text: `Requested by ${song.member.displayName}`,
        iconURL: song.user.avatarURL()
      });
  
    return {
      songEmbed: songEmbed
    };
  }  

  public static async createPlayingRow() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('np_stop')
        .setEmoji(await getEmoji('SyphiaStop'))
        .setLabel('Stop')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('np_pause')
        .setEmoji(await getEmoji('SyphiaPause'))
        .setLabel('Pause')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('Resume')
        .setEmoji(await getEmoji('SyphiaPlay'))
        .setLabel('Resume')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('np_skip')
        .setEmoji(await getEmoji('SyphiaSkip'))
        .setLabel('Skip')
        .setStyle(ButtonStyle.Secondary),
    );
  }

  public static async handleButtonInteraction(buttonInteraction: ButtonInteraction, queue: Queue) {
    const SyphiaMessage = await getEmoji('SyphiaMessage');
    const Paused = await getEmoji('SyphiaPause');
    const Started = await getEmoji('SyphiaPlay');
    const SyphiaError = await getEmoji('SyphiaError');
    const SyphiaMusic = await getEmoji('SyphiaMusic');
  
    try {
        if (buttonInteraction.replied) {
            console.log('Etkileşim zaten yanıtlandı.');
            return;
        }

        await buttonInteraction.deferUpdate();
  
        if (!queue) {
            await buttonInteraction.followUp({ content: bold(`${SyphiaMessage}${SyphiaError} Ayumi şu anda bir müzik çalmıyor`), ephemeral: true });
        } else {
            if (buttonInteraction.customId === 'np_stop') {
                PlayerHandler.Player.stop(queue.textChannel.guildId);
                await buttonInteraction.followUp({ content: bold(`${SyphiaMessage}:octagonal_sign: Mevcut şarkı durduruldu ve sıra temizlendi`), ephemeral: true });
            } else if (buttonInteraction.customId === 'np_pause') {
                PlayerHandler.Player.pause(queue.textChannel.guildId);
                await buttonInteraction.followUp({ content: bold(`${SyphiaMessage}${Paused} Müzik duraklatıldı`), ephemeral: true });
            } else if (buttonInteraction.customId === 'Resume') {
                PlayerHandler.Player.resume(queue.textChannel.guildId);
                await buttonInteraction.followUp({ content: bold(`${SyphiaMessage}${Started} Müzik başlatıldı`), ephemeral: true });
            } else if (buttonInteraction.customId === 'np_skip') {
                if (queue.songs.length === 1) {
                    await buttonInteraction.followUp({ content: bold(`${SyphiaMessage}${SyphiaMusic} Sırada başka parça kalmadı`), ephemeral: true });
                    await PlayerHandler.Player.stop(queue.textChannel.guildId);
                } else {
                    PlayerHandler.interactionMap.set(queue.id, buttonInteraction);
                    await PlayerHandler.Player.skip(queue.textChannel.guildId);
                    const newEmbed = await this.ReplaceSongEvent(queue.songs[0], queue);
                    const newButtons = await this.createPlayingRow();
                    const disabledButtons = await this.createDisabledRow();
                    const description = newEmbed.songEmbed?.data.description ?? null; 

                    if (newEmbed.songEmbed) {
                      newEmbed.songEmbed.setDescription(description);
                      await buttonInteraction.editReply({ components: [disabledButtons] });
                    } else {
                      console.error('songEmbed is not defined.');
                    }
                }
            }
        }
    } catch (error) {
        console.error('Buton işlemi sırasında bir hata oluştu:');
        console.error(error);
    }
  }

  public static async createDisabledRow() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('np_stop')
        .setLabel('Stop')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(await getEmoji('SyphiaStop'))
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('np_pause')
        .setLabel('Pause')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(await getEmoji('SyphiaPause'))
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('np_play')
        .setLabel('Resume')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(await getEmoji('SyphiaPlay'))
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('np_skip')
        .setLabel('Skip')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(await getEmoji('SyphiaSkip'))
        .setDisabled(true),
    );
  }  
}
