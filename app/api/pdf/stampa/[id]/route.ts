import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { getStampaById } from "@/lib/queries/stampe";
import { StampaPdf } from "@/lib/pdf/StampaPdf";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stampa = await getStampaById(parseInt(id, 10));

  if (!stampa) {
    return new Response("Not found", { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(createElement(StampaPdf, { stampa }) as any);

  const { negativo } = stampa;
  const { rullino } = negativo;
  const dateStr = stampa.dataStampa
    ? stampa.dataStampa.toISOString().slice(0, 10)
    : "senza-data";
  const filename = `stampa-${rullino.codiceArchivio.replace("/", "-")}-fg${negativo.numeroFotogramma}-${dateStr}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
