// Alberta stopped changing clocks on November 1, 2026, at 02:00 local time.
// https://www.alberta.ca/albertas-new-time-system-abt
const PERMANENT_ALBERTA_TIME_START = Date.parse('2026-11-01T08:00:00Z');
const clockOptions: Intl.DateTimeFormatOptions = {
  hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
};
const historicalClock = new Intl.DateTimeFormat('en-US', {
  ...clockOptions, timeZone: 'America/Edmonton', timeZoneName: 'short'
});
// IANA Etc/GMT signs are reversed: +6 means UTC−6. Using this fixed zone also
// supports browsers whose bundled time-zone data predates Alberta's change.
const albertaClock = new Intl.DateTimeFormat('en-US', {
  ...clockOptions, timeZone: 'Etc/GMT+6'
});

export function formatCalgaryTime(instant: Date): string {
  const display = instant.getTime() >= PERMANENT_ALBERTA_TIME_START
    ? `${albertaClock.format(instant)} ABT`
    : historicalClock.format(instant);
  return display.replace(/\s+/g, ' ');
}
