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



export function formatTimezoneOffset(timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    timeZoneName: "shortOffset", // Request the short offset string
  })
  .formatToParts(new Date()) // Format the current date into parts
  .find(part => part.type == "timeZoneName")?.value // Extract the timezone offset part
}