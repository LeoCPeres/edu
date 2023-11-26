export function getTimeDifference(timestamp: string): string {
  // Convert the timestamp string to a Date object
  const timestampDate = Date.parse(timestamp);

  // Get the current date and time
  const currentDate = Date.now();

  // Calculate the difference in milliseconds
  const differenceMs = currentDate - timestampDate;

  const differenceYear = Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 365));
  const differenceDay = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  const differenceHour = Math.floor(differenceMs / (1000 * 60 * 60));
  const differenceMinutes = Math.floor(differenceMs / (1000 * 60));
  const differenceSec = Math.floor(differenceMs / 1000);

  if (differenceSec < 60) {
    return "Agora mesmo";
  } else if (differenceMinutes < 60) {
    return (
      differenceMinutes +
      ` ${differenceMinutes === 1 ? "min atrás" : "mins atrás"}`
    );
  } else if (differenceHour < 24) {
    return (
      differenceHour + ` ${differenceHour === 1 ? "hora atrás" : "horas atrás"}`
    );
  } else if (differenceDay < 365) {
    return (
      (differenceDay !== 1 ? differenceDay : "") +
      ` ${differenceDay === 1 ? "Ontem" : "dias atrás"}`
    );
  } else {
    return (
      differenceYear + ` ${differenceYear === 1 ? "ano atrás" : "anos atrás"}`
    );
  }
}
