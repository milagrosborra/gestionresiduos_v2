/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function today(): string {
  // Use simulated current local date 2026-06-06
  return "06/06/2026";
}

export function parseDate(str: string): Date | null {
  if (!str) return null;
  const clean = str.replace(/_/g, "");
  const parts = clean.split("/");
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? null : d;
}

export function monthsAgo(s: string): number {
  const d = parseDate(s);
  if (!d) return 0;
  
  // Simulated today is 2026-06-06. If the browser runs in 2026, we can use the simulated year.
  const n = new Date(2026, 5, 6); // 2026-06-06
  
  return (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth());
}

export function daysBetween(d1: Date | null, d2: Date | null): number {
  if (!d1 || !d2) return 0;
  const t1 = d1.getTime();
  const t2 = d2.getTime();
  return Math.max(0, Math.round((t2 - t1) / 86400000));
}

export function exportXLSX(data: any[], headers: string[], keys: string[], filename: string) {
  const rows = [
    headers,
    ...data.map(r => keys.map(k => {
      const val = r[k];
      return val !== undefined && val !== null ? String(val).replace(/"/g, '""') : "";
    }))
  ];
  
  const csvContent = rows.map(r => r.map(v => `"${v}"`).join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportPDF(data: any[], headers: string[], keys: string[], filename: string) {
  const rows = data.map(r => keys.map(k => {
    const val = r[k];
    return val !== undefined && val !== null ? String(val) : "";
  }).join("  |  ")).join("\n");
  
  const title = "SISTEMA DE GESTIÓN INTERNA DE RESIDUOS\n";
  const sub = `${filename.toUpperCase().replace(/_/g, " ")}\n`;
  const decor = "=".repeat(100) + "\n";
  const colHeader = headers.join("  |  ") + "\n";
  const sep = "-".repeat(100) + "\n";
  
  const content = `${title}${sub}${decor}${colHeader}${sep}${rows}`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", `${filename}.txt`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
