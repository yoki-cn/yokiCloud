export const PDF_NOT_FOUND = "PRTS 检索完毕：目标 PDF 档案尚未归档，请等待后勤补全。";

export function boardPdfUrl(markdownUrl: string): string {
  return markdownUrl.replace("/algorithms/", "/algorithm-pdfs/").replace(/\.md$/, ".pdf");
}

export async function fetchBoardPdf(url: string): Promise<Blob | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`PDF request failed: ${response.status}`);
    const blob = await response.blob();
    // Some hosts return an HTML fallback with HTTP 200 for a missing file.
    if (!(await blob.slice(0, 5).text()).startsWith("%PDF-")) return null;
    return new Blob([blob], { type: "application/pdf" });
  } finally {
    clearTimeout(timer);
  }
}
