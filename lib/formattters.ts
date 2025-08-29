export function formatEventDescription(durationInMinutes: number): string {
  if (durationInMinutes < 60) {
    return `${durationInMinutes} minute${durationInMinutes === 1 ? "" : "s"}`;
  } else {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours} hr${hours === 1 ? "" : "s"}${
      minutes > 0 ? ` and ${minutes} min${minutes === 1 ? "" : "s"}` : ""
    }`;
  }
}