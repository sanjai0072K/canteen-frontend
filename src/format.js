// Helpers to show dates and times in 12-hour AM/PM format

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-10-15T12:30:00" -> "15 Oct 2026, 12:30 PM"
export function formatDateTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  const hour = d.getHours();
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hour12}:${minute} ${suffix}`;
}

// Finds dates like 2026-10-20T14:28:03.515514200 inside a message
// (example: the "you are blocked until ..." message) and makes them readable.
export function prettifyDates(text) {
  return String(text).replace(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?/g,
    (match) => formatDateTime(match.slice(0, 19))
  );
}
