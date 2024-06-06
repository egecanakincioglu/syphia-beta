export class Time {
  public static Countdown(milliseconds: number): Promise<void> {
    return new Promise((Cartel) => setTimeout(Cartel, milliseconds));
  }

  private static padWithZero(value: number): string {
    return String(value).padStart(2, '0');
  }

  public static instant(): string {
    const mainTime = new Date();

    const Hours = Time.padWithZero(mainTime.getHours());
    const Minutes = Time.padWithZero(mainTime.getMinutes());
    const Seconds = Time.padWithZero(mainTime.getSeconds());

    return `${Hours}:${Minutes}:${Seconds}`;
  }

  public static ShorTime(): string {
    const Now = Date.now();
    const Parse = Math.floor(Now / 1000);
    return `<t:${Parse}:t>`;
  }

  public static LongTime(): string {
    const Now = Date.now();
    const Parse = Math.floor(Now / 1000);
    return `<t:${Parse}:T>`;
  }

  public static ShortDate(): string {
    const Now = Date.now();
    const Parse = Math.floor(Now / 1000);
    return `<t:${Parse}:d>`;
  }

  public static LongDate(): string {
    const Now = Date.now();
    const Parse = Math.floor(Now / 1000);
    return `<t:${Parse}:D>`;
  }

  public static ShortDateTime(): string {
    const Now = Date.now();
    const Parse = Math.floor(Now / 1000);
    return `<t:${Parse}:f>`;
  }

  public static LongDateTime(): string {
    const Now = Date.now();
    const Parse = Math.floor(Now / 1000);
    return `<t:${Parse}:F>`;
  }

  public static RelativeTime(): string {
    const Now = Date.now();
    const Parse = Math.floor(Now / 1000);
    return `<t:${Parse}:R>`;
  }
}
