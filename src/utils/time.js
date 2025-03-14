export function formatTime(timeInMillis) {
  const time = new Date(timeInMillis);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    millisecond: "numeric",
    hour12: true,
  };

  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(time);

  return formattedTime;
}
