import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { getNegativoForPdf } from "@/lib/queries/pdf";
import { NegativoPdf } from "@/lib/pdf/NegativoPdf";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const negativo = await getNegativoForPdf(parseInt(id, 10));

  if (!negativo) {
    return new Response("Not found", { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(createElement(NegativoPdf, { negativo }) as any);

  const scena = negativo.scena
    ? `-${negativo.scena.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}`
    : "";
  const filename = `negativo-${negativo.rullino.codiceArchivio.replace("/", "-")}-fg${negativo.numeroFotogramma}${scena}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
