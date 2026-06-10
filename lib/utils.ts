export function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateFlex(
  date: Date | null | undefined,
  precisione: string | null | undefined,
  fine?: Date | null | undefined
): string {
  if (!date) return "—";
  const d = new Date(date);
  switch (precisione) {
    case "anno":
      return String(d.getUTCFullYear());
    case "mese":
      return d.toLocaleDateString("it-IT", { month: "long", year: "numeric", timeZone: "UTC" });
    case "intervallo": {
      const fmt = (dt: Date) =>
        new Date(dt).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        });
      return fine ? `${fmt(d)} — ${fmt(new Date(fine))}` : fmt(d);
    }
    default:
      return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
}
