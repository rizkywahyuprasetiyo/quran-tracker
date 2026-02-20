export const TOTAL_PAGES = 604;
export const LINES_PER_PAGE = 15;

export interface PagePosition {
  page: number;
  line: number;
}

// Convert halaman desimal ke page + line
// Contoh: 45.5 = Halaman 45, Baris 8 (0.5 * 15 = 7.5 → dibulatkan ke atas = 8)
export function decimalToPageLine(decimalPage: number): PagePosition {
  const page = Math.floor(decimalPage);
  const line = Math.ceil((decimalPage - page) * LINES_PER_PAGE);
  
  return {
    page: Math.min(Math.max(page, 1), TOTAL_PAGES),
    line: Math.min(Math.max(line, 1), LINES_PER_PAGE),
  };
}

// Convert page + line ke halaman desimal
export function pageLineToDecimal(page: number, line: number): number {
  return page + (line - 1) / LINES_PER_PAGE;
}

// Format halaman dan baris untuk display
export function formatPageLine(position: PagePosition): string {
  return `Halaman ${position.page}, Baris ${position.line}`;
}

// Format untuk progress percentage
export function calculateProgressPercentage(
  currentDecimalPage: number,
  totalPages: number
): number {
  return Math.min((currentDecimalPage / totalPages) * 100, 100);
}
