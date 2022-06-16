function toCompliantFormattedString(date: Date): string {
  return date.toISOString().
  replace(/-/g, '').       // delete hyphens
  replace(/:/g, '').       // delete colons
  replace(/\..+/, '');     // delete the dot and everything after
}

export {
  toCompliantFormattedString,
}