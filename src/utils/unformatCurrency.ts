export function unformatPrice(value: string) {
  return Number(value.replace(/\D/g, "")) / 100;
}
