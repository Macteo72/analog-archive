import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDateFlex } from "@/lib/utils";
import type { getRullinoForPdf } from "@/lib/queries/pdf";

type RullinoData = NonNullable<Awaited<ReturnType<typeof getRullinoForPdf>>>;

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
  hdrCode: { fontSize: 14, fontFamily: "Helvetica-Bold", color: C.black },
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
  lbl: { width: 100, fontSize: 8, color: C.label },
  val: { flex: 1, fontSize: 8, color: C.text },
  longLbl: { fontSize: 8, color: C.label, marginBottom: 2, marginTop: 4 },
  longVal: { fontSize: 8, color: C.text, lineHeight: 1.4 },
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
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: C.light,
  },
  tblCell: { fontSize: 8, color: C.text },
  colNo: { width: 24 },
  colScena: { flex: 1 },
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

function fd(
  d: Date | null | undefined,
  prec?: string | null,
  fine?: Date | null
): string | null {
  if (!d) return null;
  return formatDateFlex(d, prec, fine);
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

export function RullinoPdf({ rullino }: { rullino: RullinoData }) {
  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.hdr} fixed>
          <View>
            <Text style={s.hdrBrand}>ANALOG ARCHIVE</Text>
            <Text style={s.hdrSub}>Matteo Morandini</Text>
          </View>
          <View>
            <Text style={s.hdrCode}>{rullino.codiceArchivio}</Text>
            <Text style={s.hdrType}>Scheda Rullino</Text>
          </View>
        </View>

        <View style={s.titleBlock}>
          <Text style={s.title}>{rullino.pellicola}</Text>
          <Text style={s.titleSub}>{rullino.codiceArchivio}</Text>
        </View>

        <View style={s.cols}>
          <View style={s.col}>
            <View style={s.sec}>
              <Text style={s.secTitle}>RIPRESA</Text>
              <R l="Formato" v={`${rullino.formato}mm`} />
              <R
                l="Sensibilità"
                v={rullino.sensibilita ? `${rullino.sensibilita} ISO` : null}
              />
              <R l="Fotocamera" v={rullino.fotocamera} />
              <R l="Focale" v={rullino.focale} />
              <R l="Data scatti" v={fd(rullino.dataScatti, rullino.dataScattiPrecisione, rullino.dataScattiFine)} />
              <R
                l="Provino a contatto"
                v={rullino.provinoContatto ? "Sì" : null}
              />
              {rullino.scene ? (
                <View>
                  <Text style={s.longLbl}>Scene</Text>
                  <Text style={s.longVal}>{rullino.scene}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={s.col}>
            <View style={s.sec}>
              <Text style={s.secTitle}>SVILUPPO</Text>
              <R l="Prodotto" v={rullino.prodottoSviluppo} />
              <R l="Diluizione" v={rullino.diluizione} />
              <R l="Tempo" v={rullino.tempoSviluppo} />
              <R
                l="Temperatura"
                v={
                  rullino.tempSviluppo != null
                    ? `${rullino.tempSviluppo}°C`
                    : null
                }
              />
              <R l="Data sviluppo" v={fd(rullino.dataSviluppo, rullino.dataSviluppoPrecisione, rullino.dataSviluppoFine)} />
              {rullino.noteSviluppo ? (
                <View>
                  <Text style={s.longLbl}>Note</Text>
                  <Text style={s.longVal}>{rullino.noteSviluppo}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {rullino.negativi.length > 0 ? (
          <View style={s.sec}>
            <Text style={s.secTitle}>
              FOTOGRAMMI ({rullino.negativi.length})
            </Text>
            <View style={s.tblHdr}>
              <Text style={[s.tblHdrCell, s.colNo]}>N.</Text>
              <Text style={[s.tblHdrCell, s.colScena]}>Scena / Soggetto</Text>
            </View>
            {rullino.negativi.map((neg) => (
              <View key={neg.id} style={s.tblRow}>
                <Text style={[s.tblCell, s.colNo]}>
                  {neg.numeroFotogramma}
                </Text>
                <Text style={[s.tblCell, s.colScena]}>{neg.scena ?? "—"}</Text>
              </View>
            ))}
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
