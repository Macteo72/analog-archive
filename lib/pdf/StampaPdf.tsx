import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "@/lib/utils";
import type { getStampaById } from "@/lib/queries/stampe";

type StampaData = NonNullable<Awaited<ReturnType<typeof getStampaById>>>;

const C = {
  black: "#111827",
  text: "#374151",
  muted: "#6b7280",
  label: "#9ca3af",
  border: "#e5e7eb",
  light: "#f3f4f6",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.text,
    paddingTop: 40,
    paddingBottom: 52,
    paddingHorizontal: 48,
  },
  hdr: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  hdrBrand: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.black },
  hdrSub: { fontSize: 7, color: C.label, marginTop: 2 },
  hdrRight: { alignItems: "flex-end" },
  hdrCode: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.black },
  hdrType: { fontSize: 7, color: C.label, marginTop: 2 },
  titleBlock: { marginBottom: 20 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", color: C.black },
  titleSub: { fontSize: 10, color: C.muted, marginTop: 3 },
  cols: { flexDirection: "row", marginBottom: 0 },
  col: { flex: 1, paddingRight: 16 },
  sec: { marginBottom: 16 },
  secTitle: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: C.label,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  row: { flexDirection: "row", marginBottom: 3 },
  lbl: { width: 110, fontSize: 8, color: C.label },
  val: { flex: 1, fontSize: 8, color: C.text },
  // Chemistry table
  chemTableHdr: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    paddingBottom: 3,
    marginBottom: 3,
  },
  chemTableHdrCell: { fontSize: 6, fontFamily: "Helvetica-Bold", color: C.label },
  chemRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: C.light,
  },
  chemCell: { fontSize: 8, color: C.text },
  chemLbl: { width: 64 },
  chemProd: { flex: 1 },
  chemTemp: { width: 52 },
  chemTempo: { width: 60 },
  longLbl: { fontSize: 8, color: C.label, marginBottom: 2 },
  longVal: { fontSize: 8, color: C.text, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    paddingTop: 5,
  },
  footerText: { fontSize: 7, color: C.label },
});

function fd(d: Date | null | undefined): string | null {
  if (!d) return null;
  return formatDate(d);
}

function R({ l, v }: { l: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <View style={s.row}>
      <Text style={s.lbl}>{l}</Text>
      <Text style={s.val}>{v}</Text>
    </View>
  );
}

function ChemRow({
  label,
  prodotto,
  temp,
  tempo,
}: {
  label: string;
  prodotto: string | null;
  temp: number | null;
  tempo: string | null;
}) {
  if (!prodotto && temp == null && !tempo) return null;
  return (
    <View style={s.chemRow}>
      <Text style={[s.chemCell, s.chemLbl]}>{label}</Text>
      <Text style={[s.chemCell, s.chemProd]}>{prodotto ?? "—"}</Text>
      <Text style={[s.chemCell, s.chemTemp]}>
        {temp != null ? `${temp}°C` : "—"}
      </Text>
      <Text style={[s.chemCell, s.chemTempo]}>{tempo ?? "—"}</Text>
    </View>
  );
}

export function StampaPdf({ stampa }: { stampa: StampaData }) {
  const { negativo } = stampa;
  const { rullino } = negativo;
  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const titolo = stampa.dataStampa
    ? `Stampa del ${formatDate(stampa.dataStampa)}`
    : "Sessione di stampa";

  const hasChimica =
    stampa.svil_prodotto ||
    stampa.stop_prodotto ||
    stampa.fiss_prodotto ||
    stampa.svil_temp != null ||
    stampa.stop_temp != null ||
    stampa.fiss_temp != null;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.hdr} fixed>
          <View>
            <Text style={s.hdrBrand}>ANALOG ARCHIVE</Text>
            <Text style={s.hdrSub}>Matteo Morandini</Text>
          </View>
          <View style={s.hdrRight}>
            <Text style={s.hdrCode}>
              {rullino.codiceArchivio} · Fg. {negativo.numeroFotogramma}
            </Text>
            <Text style={s.hdrType}>Scheda Sessione di Stampa</Text>
          </View>
        </View>

        <View style={s.titleBlock}>
          <Text style={s.title}>{titolo}</Text>
          <Text style={s.titleSub}>
            {rullino.codiceArchivio} — Fotogramma {negativo.numeroFotogramma}
            {negativo.scena ? ` — ${negativo.scena}` : ""}
          </Text>
        </View>

        <View style={s.cols}>
          {/* Riferimenti + Ingranditore */}
          <View style={s.col}>
            <View style={s.sec}>
              <Text style={s.secTitle}>RIFERIMENTI</Text>
              <R l="Data stampa" v={fd(stampa.dataStampa)} />
              <R l="Carta fotografica" v={stampa.carta} />
              <R l="Formato stampa" v={stampa.formatoStampa} />
            </View>
            <View style={s.sec}>
              <Text style={s.secTitle}>INGRANDITORE</Text>
              <R l="Filtro contrasto" v={stampa.filtroContrasto} />
              <R l="Apertura obiettivo" v={stampa.aperturaObj} />
              <R l="Tempo esposizione" v={stampa.tempoEsposizione} />
            </View>
          </View>

          {/* Chimica */}
          <View style={s.col}>
            {hasChimica ? (
              <View style={s.sec}>
                <Text style={s.secTitle}>CHIMICA CAMERA OSCURA</Text>
                <View style={s.chemTableHdr}>
                  <Text style={[s.chemTableHdrCell, s.chemLbl]} />
                  <Text style={[s.chemTableHdrCell, s.chemProd]}>Prodotto</Text>
                  <Text style={[s.chemTableHdrCell, s.chemTemp]}>Temp.</Text>
                  <Text style={[s.chemTableHdrCell, s.chemTempo]}>Tempo</Text>
                </View>
                <ChemRow
                  label="Sviluppo"
                  prodotto={stampa.svil_prodotto}
                  temp={stampa.svil_temp}
                  tempo={stampa.svil_tempo}
                />
                <ChemRow
                  label="Stop"
                  prodotto={stampa.stop_prodotto}
                  temp={stampa.stop_temp}
                  tempo={stampa.stop_tempo}
                />
                <ChemRow
                  label="Fissaggio"
                  prodotto={stampa.fiss_prodotto}
                  temp={stampa.fiss_temp}
                  tempo={stampa.fiss_tempo}
                />
              </View>
            ) : null}
          </View>
        </View>

        {(stampa.interventi || stampa.note) ? (
          <View style={s.sec}>
            <Text style={s.secTitle}>INTERVENTI E NOTE</Text>
            {stampa.interventi ? (
              <View style={{ marginBottom: 8 }}>
                <Text style={s.longLbl}>Interventi</Text>
                <Text style={s.longVal}>{stampa.interventi}</Text>
              </View>
            ) : null}
            {stampa.note ? (
              <View>
                <Text style={s.longLbl}>Note</Text>
                <Text style={s.longVal}>{stampa.note}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Analog Archive — Matteo Morandini</Text>
          <Text style={s.footerText}>{today}</Text>
        </View>
      </Page>
    </Document>
  );
}
