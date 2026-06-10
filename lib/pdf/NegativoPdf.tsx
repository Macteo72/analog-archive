import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "@/lib/utils";
import type { getNegativoForPdf } from "@/lib/queries/pdf";

type NegativoData = NonNullable<Awaited<ReturnType<typeof getNegativoForPdf>>>;

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
  longLbl: { fontSize: 8, color: C.label, marginBottom: 2, marginTop: 4 },
  longVal: { fontSize: 8, color: C.text, lineHeight: 1.4 },
  rullinoCols: { flexDirection: "row" },
  rullinoCol: { flex: 1, paddingRight: 16 },
  // Stampe table
  tblHdr: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    paddingBottom: 3,
    marginBottom: 2,
  },
  tblHdrCell: { fontSize: 6, fontFamily: "Helvetica-Bold", color: C.label },
  tblRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: C.light,
  },
  tblCell: { fontSize: 8, color: C.text },
  colData: { width: 70 },
  colCarta: { flex: 1, paddingRight: 4 },
  colFormato: { width: 50 },
  colFiltro: { width: 40 },
  colTempo: { width: 50 },
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

export function NegativoPdf({ negativo }: { negativo: NegativoData }) {
  const { rullino, stampe } = negativo;
  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const titolo = negativo.scena
    ? `Fotogramma ${negativo.numeroFotogramma} — ${negativo.scena}`
    : `Fotogramma ${negativo.numeroFotogramma}`;

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
            <Text style={s.hdrType}>Scheda Negativo</Text>
          </View>
        </View>

        <View style={s.titleBlock}>
          <Text style={s.title}>{titolo}</Text>
          <Text style={s.titleSub}>{rullino.codiceArchivio} — {rullino.pellicola}</Text>
        </View>

        {negativo.descrizione ? (
          <View style={s.sec}>
            <Text style={s.secTitle}>DESCRIZIONE</Text>
            <Text style={s.longVal}>{negativo.descrizione}</Text>
          </View>
        ) : null}

        <View style={s.sec}>
          <Text style={s.secTitle}>RULLINO DI APPARTENENZA</Text>
          <View style={s.rullinoCols}>
            <View style={s.rullinoCol}>
              <R l="Codice archivio" v={rullino.codiceArchivio} />
              <R l="Pellicola" v={rullino.pellicola} />
              <R l="Formato" v={`${rullino.formato}mm`} />
              <R
                l="Sensibilità"
                v={rullino.sensibilita ? `${rullino.sensibilita} ISO` : null}
              />
              <R l="Fotocamera" v={rullino.fotocamera} />
              <R l="Focale" v={rullino.focale} />
              <R l="Data scatti" v={fd(rullino.dataScatti)} />
            </View>
            <View style={s.rullinoCol}>
              <R l="Prodotto sviluppo" v={rullino.prodottoSviluppo} />
              <R l="Diluizione" v={rullino.diluizione} />
              <R l="Tempo sviluppo" v={rullino.tempoSviluppo} />
              <R
                l="Temperatura"
                v={
                  rullino.tempSviluppo != null
                    ? `${rullino.tempSviluppo}°C`
                    : null
                }
              />
              <R l="Data sviluppo" v={fd(rullino.dataSviluppo)} />
            </View>
          </View>
        </View>

        <View style={s.sec}>
          <Text style={s.secTitle}>
            SESSIONI DI STAMPA ({stampe.length})
          </Text>
          {stampe.length === 0 ? (
            <Text style={{ fontSize: 8, color: C.label }}>
              Nessuna sessione di stampa registrata.
            </Text>
          ) : (
            <>
              <View style={s.tblHdr}>
                <Text style={[s.tblHdrCell, s.colData]}>Data</Text>
                <Text style={[s.tblHdrCell, s.colCarta]}>Carta</Text>
                <Text style={[s.tblHdrCell, s.colFormato]}>Formato</Text>
                <Text style={[s.tblHdrCell, s.colFiltro]}>Filtro</Text>
                <Text style={[s.tblHdrCell, s.colTempo]}>Esposizione</Text>
              </View>
              {stampe.map((st) => (
                <View key={st.id} style={s.tblRow}>
                  <Text style={[s.tblCell, s.colData]}>
                    {fd(st.dataStampa) ?? "—"}
                  </Text>
                  <Text style={[s.tblCell, s.colCarta]}>{st.carta ?? "—"}</Text>
                  <Text style={[s.tblCell, s.colFormato]}>
                    {st.formatoStampa ?? "—"}
                  </Text>
                  <Text style={[s.tblCell, s.colFiltro]}>
                    {st.filtroContrasto ?? "—"}
                  </Text>
                  <Text style={[s.tblCell, s.colTempo]}>
                    {st.tempoEsposizione ?? "—"}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Analog Archive — Matteo Morandini</Text>
          <Text style={s.footerText}>{today}</Text>
        </View>
      </Page>
    </Document>
  );
}
