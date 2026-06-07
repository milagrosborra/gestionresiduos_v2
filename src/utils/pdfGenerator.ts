/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { TasaGeneracion } from "../types";

export function exportIndicadoresPDF(
  tipo: "interno" | "externo",
  totalKg: number,
  totalReg: number,
  byCorriente: Record<string, number>,
  byCat: Record<string, number>,
  tasaGen: TasaGeneracion[]
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const currentDate = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Calculate percentages and basic values
  const totalPages = tipo === "externo" && tasaGen.length > 0 ? 2 : 1;

  // Render Page 1
  drawPage1(doc, tipo, totalKg, totalReg, byCorriente, byCat, currentDate, totalPages);

  // Render Page 2 if outbound (externo) and there is generation rates (tasaGen)
  if (tipo === "externo" && tasaGen.length > 0) {
    doc.addPage();
    drawPage2(doc, tasaGen, currentDate, totalPages);
  }

  // Save the file
  const filename = `Reporte_Indicadores_${tipo === "interno" ? "Internos" : "Externos"}_SGI.pdf`;
  doc.save(filename);
}

function drawPage1(
  doc: jsPDF,
  tipo: "interno" | "externo",
  totalKg: number,
  totalReg: number,
  byCorriente: Record<string, number>,
  byCat: Record<string, number>,
  currentDate: string,
  totalPages: number
) {
  // Page Background (Soft Off-White)
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, "F");

  // Header Banner Block (Deep Slate Gray)
  doc.setFillColor(15, 23, 42);
  doc.rect(15, 15, 180, 25, "F");

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SGI • REPORTE DE TRAZABILIDAD AMBIENTAL", 20, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(224, 242, 254);
  const gestionStr = tipo === "interno" ? "INTERNA (ALMACENAMIENTO)" : "EXTERNA (DESPACHO Y DISPOSICIÓN)";
  doc.text(`INDICADORES DE CONTROL ESTADÍSTICO • GESTIÓN ${gestionStr}`, 20, 30);

  // Header Metadata (right side)
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Cód: SGI-INDICADORES`, 152, 24);
  doc.text(`${currentDate}hs`, 152, 30);

  // Border Accent Line
  doc.setFillColor(14, 165, 233); // Sky Blue
  doc.rect(15, 40, 180, 1.5, "F");

  // ==========================================
  // KPI PANELS (Side by Side)
  // ==========================================
  const kpiY = 47;
  const kpiW = 87;
  const kpiH = 22;

  // KPI 1: Volumen total acopiado
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, kpiY, kpiW, kpiH, "FD");
  
  // Left side green/blue decoration bar
  doc.setFillColor(2, 132, 199); // Sky
  doc.rect(15, kpiY, 2, kpiH, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("VOLUMEN GENERAL REGISTRADO", 21, kpiY + 6);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${totalKg.toLocaleString()} kg / lt`, 21, kpiY + 15);

  // KPI 2: Cantidad Operaciones
  doc.setFillColor(255, 255, 255);
  doc.rect(108, kpiY, kpiW, kpiH, "FD");
  
  // Left side teal decoration bar
  doc.setFillColor(13, 148, 136); // Teal
  doc.rect(108, kpiY, 2, kpiH, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("CANTIDAD DE OPERACIONES REGISTRADAS", 114, kpiY + 6);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${totalReg} ${totalReg === 1 ? "Operación" : "Operaciones"}`, 114, kpiY + 15);


  // ==========================================
  // SECTION 1: DISTRIBUCIÓN POR CORRIENTE
  // ==========================================
  let currentY = 78;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("1. DISTRIBUCIÓN DE VOLUMEN POR CORRIENTE DE RESIDUOS", 15, currentY);

  // Underline section
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(15, currentY + 2, 195, currentY + 2);

  currentY += 10;

  const corrLabels = Object.keys(byCorriente);
  if (corrLabels.length === 0) {
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Sin datos de corrientes cargados en el sistema.", 20, currentY);
    currentY += 10;
  } else {
    // Take elements
    const corrVals = corrLabels.map(k => byCorriente[k] || 0);
    const maxVal = Math.max(...corrVals, 1);

    corrLabels.forEach((label, idx) => {
      const val = byCorriente[label] || 0;
      const pct = (val / (totalKg || 1)) * 100;
      const progressPct = (val / maxVal) * 100;

      // Draw text
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      
      const labelText = label.length > 55 ? label.substring(0, 52) + "..." : label;
      doc.text(`${labelText}`, 15, currentY);
      
      const valText = `${val.toLocaleString()} kg  •  ${pct.toFixed(1)}%`;
      const valTextWidth = doc.getTextWidth(valText);
      doc.text(valText, 195 - valTextWidth, currentY);

      // Draw progress bar
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(15, currentY + 2, 180, 2.5, "F");

      // Color palette for bars
      const idxColors = [
        [46, 134, 193], // Sky
        [19, 141, 117], // Teal
        [235, 152, 78],  // Orange
        [136, 78, 160],  // Violet
        [125, 102, 8],   // Yellow
        [220, 38, 38]    // Red
      ];
      const barCol = idxColors[idx % idxColors.length];
      doc.setFillColor(barCol[0], barCol[1], barCol[2]);
      
      const fillW = (progressPct / 100) * 180;
      doc.rect(15, currentY + 2, fillW > 0 ? fillW : 1, 2.5, "F");

      currentY += 11;
    });
  }

  // ==========================================
  // SECTION 2: DISTRIBUCIÓN POR CATEGORÍA
  // ==========================================
  currentY = 160;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("2. DESGLOSE POR CLASIFICACIÓN Y CATEGORÍA JURÍDICA", 15, currentY);

  doc.setDrawColor(203, 213, 225);
  doc.line(15, currentY + 2, 195, currentY + 2);

  currentY += 10;

  const catEntries = Object.entries(byCat);
  if (catEntries.length === 0) {
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Sin datos de categorías registradas en el sistema.", 20, currentY);
  } else {
    // Render categories side-by-side or stacked cleanly
    catEntries.forEach(([cat, val]) => {
      const pct = (val / (totalKg || 1)) * 100;
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, currentY, 180, 11, "FD");

      // Side vertical accent
      // Assign category color
      let col = [100, 116, 139]; // Default slate
      if (cat.toLowerCase().includes("peligroso") || cat.toLowerCase().includes("peligrosos")) {
        col = [220, 38, 38]; // Red
      } else if (cat.toLowerCase().includes("especial") || cat.toLowerCase().includes("especiales")) {
        col = [217, 119, 6]; // Amber
      } else if (cat.toLowerCase().includes("no peligroso") || cat.toLowerCase().includes("no peligrosos")) {
        col = [13, 148, 136]; // Teal
      } else if (cat.toLowerCase().includes("asimilable") || cat.toLowerCase().includes("asimilables")) {
        col = [37, 99, 235]; // Royal Blue
      }
      doc.setFillColor(col[0], col[1], col[2]);
      doc.rect(15, currentY, 2, 11, "F");

      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(`${cat}`, 20, currentY + 7);

      doc.setTextColor(15, 23, 42);
      const rightText = `${val.toLocaleString()} kg / lt  (${pct.toFixed(1)}%)`;
      const textW = doc.getTextWidth(rightText);
      doc.text(rightText, 190 - textW, currentY + 7);

      currentY += 14;
    });
  }

  // Draw Page 1 Footer
  drawPageFooter(doc, 1, totalPages, currentDate);
}

function drawPage2(
  doc: jsPDF,
  tasaGen: TasaGeneracion[],
  currentDate: string,
  totalPages: number
) {
  // Page Background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, "F");

  // Header Banner Block (Teal/Slate Mix for Operational metrics)
  doc.setFillColor(13, 148, 136); // Teal theme for operational rates
  doc.rect(15, 15, 180, 20, "F");

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SGI • ANÁLISIS OPERATIVO Y TASAS DE GENERACIÓN", 20, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(204, 251, 241);
  doc.text("VELOCIDAD PROMEDIO DE ACOPIO Y CAPACIDAD LOGÍSTICA DE RETIRO", 20, 29);

  // Metadata
  doc.setFontSize(8);
  doc.setTextColor(204, 251, 241);
  doc.text("Cód: SGI-RATES", 162, 24);

  // Section Title
  const startY = 46;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("3. MATRIZ DE RENDIMIENTO Y VELOCIDAD DE GENERACIÓN NETO", 15, startY);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(15, startY + 2, 195, startY + 2);

  // Draw Table header
  const tableY = startY + 9;
  doc.setFillColor(15, 23, 42); // slate 900
  doc.rect(15, tableY, 180, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  
  // Headers text placement
  doc.text("CORRIENTE DE RESIDUO", 19, tableY + 5.5);
  doc.text("DESPACHO NETO", 78, tableY + 5.5);
  doc.text("INTERVALO", 112, tableY + 5.5);
  doc.text("TASA DIARIA", 140, tableY + 5.5);
  doc.text("TASA MENSUAL", 168, tableY + 5.5);

  let rowY = tableY + 8;
  tasaGen.forEach((t, i) => {
    // Alternate backgrounds
    if (i % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(241, 245, 249); // slate 100
    }
    doc.rect(15, rowY, 180, 8, "F");
    
    // Draw grid border lines
    doc.setDrawColor(226, 232, 240);
    doc.line(15, rowY + 8, 195, rowY + 8);

    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    const flowText = t.corriente.length > 34 ? t.corriente.substring(0, 31) + "..." : t.corriente;
    doc.text(flowText, 19, rowY + 5);

    doc.setFont("helvetica", "normal");
    doc.text(`${t.cantTotal.toLocaleString()} ${t.unidad}`, 78, rowY + 5);
    doc.text(`${t.dias} días`, 112, rowY + 5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(2, 132, 199); // Sky
    doc.text(`${t.tasaDia.toFixed(2)} / día`, 140, rowY + 5);

    doc.setTextColor(13, 148, 136); // Teal
    doc.text(`${t.tasaMes.toFixed(1)} / mes`, 168, rowY + 5);

    rowY += 8;
  });

  // Descriptive / Informative container below table
  const infoY = rowY + 12;
  doc.setFillColor(240, 249, 255); // Soft blue sky-50
  doc.setDrawColor(186, 230, 253); // sky-200
  doc.rect(15, infoY, 180, 32, "FD");

  doc.setFillColor(2, 132, 199);
  doc.rect(15, infoY, 1.5, 32, "F");

  doc.setTextColor(3, 105, 161); // sky-700
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("METODOLOGÍA DE CÁLCULO LOGÍSTICO REQUERIDO", 20, infoY + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  
  const rules = [
    "• La Tasa Diaria representa la inclinación promedio de volumen acumulado entre retiros sucesivos.",
    "• Cómputo Cronológico: Toma la fecha del segundo registro en el historial como hito de inicio de ciclo.",
    "• Exclusión de Sesgo: El volumen del primer retiro inicial se excluye para medir el ritmo de generación real.",
    "• Tasa Mensual Proyectada: Multiplica la tasa diaria promedio del residuo analizado por un ciclo comercial de 30 días.",
  ];

  rules.forEach((line, index) => {
    doc.text(line, 20, infoY + 13 + index * 4.5);
  });

  // Performance audit notes container
  const auditY = infoY + 42;
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("RECOMENDACIÓN TÉCNICA DE ALMACENAMIENTO MÁXIMO:", 15, auditY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const auditQuote = 
    "En base a las tasas mensuales obtenidas, se aconseja programar retiros de residuos peligrosos con una frecuencia que no exceda el 80% de la capacidad de acopio transitorio físico para prevenir excedentes bajo marcos normativos legales.";
  const splitQuote = doc.splitTextToSize(auditQuote, 180);
  doc.text(splitQuote, 15, auditY + 5.5);

  // Clean decorative separator for official stamp
  doc.setDrawColor(226, 232, 240);
  doc.line(15, auditY + 22, 195, auditY + 22);

  // Authority Block signatures
  const signY = auditY + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("DEPARTAMENTO DE CONTROL Y SEGURIDAD AMBIENTAL", 15, signY);
  doc.text("Firma de Validación SGI: AUTORIZADO CC-SGI-OK", 15, signY + 4);
  
  // Draw barcode lines decoration
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.text("|||||| | |||| || ||| || |||| |||| ||| |||||||", 150, signY);
  doc.text("VERIFICACIÓN DIRECTA SGI DIGITAL", 150, signY + 4.5);

  // Draw Page 2 Footer
  drawPageFooter(doc, 2, totalPages, currentDate);
}

function drawPageFooter(
  doc: jsPDF,
  page: number,
  totalPages: number,
  currentDate: string
) {
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(15, 280, 195, 280);

  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text(`REPORTE DE INDICADORES • SISTEMA SGI AMBIENTAL`, 15, 284.5);
  
  const stampText = `CÓD. CONTROL: CERT-TRAC-${currentDate.replace(/[\s\/:,]/g, "")}-OK`;
  doc.setFont("helvetica", "normal");
  doc.text(stampText, 70, 284.5);

  const pageStr = `Página ${page} de ${totalPages}`;
  const pageW = doc.getTextWidth(pageStr);
  doc.text(pageStr, 195 - pageW, 284.5);
}
