import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { getRullinoForPdf } from "@/lib/queries/pdf";
import { RullinoPdf } from "@/lib/pdf/RullinoPdf";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rullino = await getRullinoForPdf(parseInt(id, 10));

  if (!rullino) {
    return new Response("Not found", { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(createElement(RullinoPdf, { rullino }) as any);
  const filename = `rullino-${rullino.codiceArchivio.replace("/", "-")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
