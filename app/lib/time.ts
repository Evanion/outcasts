/**
 * Transforms a human-readable duration string into milliseconds.
 * @param duration The duration in human-readable format, e.g., "2h", "30m", "15s".
 * @returns The duration in milliseconds.
 * @example
 * ```ts
 * import { time } from './time';
 * time`1d`; // returns 86400000
 * time`2h`; // returns 7200000
 * time`30m`; // returns 1800000
 * time`15s`; // returns 15000
 * time`2d 3h 30m 15s`; // returns 183615000
 * time`1w 2d 3h 4m 5s`; // returns 777865000
 * time`1y 3mo 2w 3d 4h 5m 6s`; // returns 315576000000 + 7776000000 + 259200000 + 345600000 + 14400000 + 300000 + 6000
 * ```
 * @throws {Error} If the duration format is invalid.
 *
 */
export function time(duration: TemplateStringsArray): number {
  const durationString = duration[0].trim();
  const regex = /(\d+)([a-z]+)/g;
  let totalMilliseconds = 0;

  const units: Record<string, number> = {
    y: 31557600000, // year
    mo: 2592000000, // month (30 days)
    w: 604800000, // week
    d: 86400000, // day
    h: 3600000, // hour
    m: 60000, // minute
    s: 1000, // second
  };

  let match;
  while ((match = regex.exec(durationString)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (units[unit]) {
      totalMilliseconds += value * units[unit];
    } else {
      throw new Error(`Invalid time unit: ${unit}`);
    }
  }

  return totalMilliseconds;
}
