/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { RegistroInterno, RetiroExterno, TasaGeneracion } from "../types";
import { CAT_COLOR, COLORS } from "../constants";
import { parseDate, daysBetween } from "../utils";
import { TrendingUp, FileSpreadsheet, Scale, Info } from "lucide-react";

interface DashboardChartsProps {
  registros: RegistroInterno[];
  retiros: RetiroExterno[];
  tipo: "interno" | "externo";
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ registros, retiros, tipo }) => {
  const data = tipo === "interno" ? registros : retiros;
  const cantField = tipo === "interno" ? "cantidad" : "cantEst";

  const getVal = (val: any): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(/[^0-9.-]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };
  
  const totalKg = data.reduce((s, r) => s + getVal(r[cantField]), 0);
  const totalReg = data.length;
  
  const CHART_COLORS = [
    "#2e86c1", "#138d75", "#eb984e", "#7d6608", "#884ea0", "#17a589", "#2471a3"
  ];

  // 1. Calculations: Cumulative metrics relative to stream type
  const byCorriente = useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach(r => {
      m[r.corriente] = (m[r.corriente] || 0) + getVal(r[cantField]);
    });
    return m;
  }, [data, cantField]);

  // 2. Calculations: Cumulative metrics relative to category classification
  const byCat = useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach(r => {
      m[r.categoria] = (m[r.categoria] || 0) + getVal(r[cantField]);
    });
    return m;
  }, [data, cantField]);

  // 3. Calculations: Cumulative metrics relative to calendar month
  const byMonth = useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach(r => {
      const d = parseDate(r.fecha);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      m[key] = (m[key] || 0) + getVal(r[cantField]);
    });
    return m;
  }, [data, cantField]);

  const monthLabels = Object.keys(byMonth).sort().slice(-10);
  const monthVals = monthLabels.map(k => byMonth[k] || 0);
  const corrLabels = Object.keys(byCorriente);
  const corrVals = corrLabels.map(k => byCorriente[k]);

  // 4. Custom Generation rate calculation for outbound shipping logs
  const tasaGen = useMemo<TasaGeneracion[]>(() => {
    if (tipo !== "externo") return [];
    
    return corrLabels.map(corriente => {
      // Find matching outbound retiros, sorted chronologically
      const streamRetiros = retiros
        .filter(r => r.corriente === corriente)
        .map(r => ({
          ...r,
          parsedDate: parseDate(r.fechaRetiro || r.fecha)
        }))
        .filter((r): r is typeof r & { parsedDate: Date } => r.parsedDate !== null)
        .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
        
      if (streamRetiros.length < 2) return null;
      
      // "toma la fecha de retiro desde el segundo registro" as start date
      const startDate = streamRetiros[1].parsedDate;
      // Last retirement date as end date
      const endDate = streamRetiros[streamRetiros.length - 1].parsedDate;
      
      // "no consideres el peso del primer retiro" -> Sum quantity starting from the second record (index 1)
      const rRemaining = streamRetiros.slice(1);
      const cantTotal = rRemaining.reduce((sum, r) => sum + getVal(r.cantEst), 0);
      
      const dias = daysBetween(startDate, endDate);
      const validDays = dias || 1; // Safeguard division by zero
      
      const unitCo = streamRetiros[0].unidad || "kg";
      
      return {
        corriente,
        tasaDia: cantTotal / validDays,
        tasaMes: (cantTotal / validDays) * 30,
        dias: validDays,
        cantTotal,
        unidad: unitCo
      };
    }).filter((t): t is TasaGeneracion => t !== null);
  }, [tipo, corrLabels, retiros]);

  return (
    <div className="space-y-6">
      
      {/* Metrics Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Volumen Técnico {tipo === "interno" ? "Acopiado" : "Despachado"}
            </span>
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              {totalKg.toLocaleString()}
              <span className="text-sm text-slate-500 font-medium ml-1.5 uppercase">Kilogramos / Litros</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <Scale className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Cantidad de Registros Guardados
            </span>
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              {totalReg}
              <span className="text-sm text-slate-500 font-medium ml-1.5 uppercase">Operaciones</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Generation rate detail if outbound */}
      {tipo === "externo" && tasaGen.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-800 m-0 uppercase tracking-wide">
                Tasa de Generación y Acopio Neto por Corriente
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Tasa calculada a partir de la fecha de retiro del segundo registro de retiro y excluyendo el peso del primer retiro. Refleja la velocidad promedio de generación.
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-sky-100 text-sky-950 border-b border-sky-200 select-none">
                  <th className="p-3 font-semibold text-center tracking-wider">Corriente</th>
                  <th className="p-3 font-semibold text-center tracking-wider">Despacho total</th>
                  <th className="p-3 font-semibold text-center tracking-wider">Duración total</th>
                  <th className="p-3 font-semibold text-center tracking-wider">Tasa diaria</th>
                  <th className="p-3 font-semibold text-center tracking-wider">Tasa mensual</th>
                </tr>
              </thead>
              <tbody>
                {tasaGen.map((t, i) => (
                  <tr 
                    key={t.corriente} 
                    className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                    }`}
                  >
                    <td className="p-3 font-bold text-slate-800">{t.corriente}</td>
                    <td className="p-3 text-slate-600 font-medium">{t.cantTotal.toLocaleString()} {t.unidad}</td>
                    <td className="p-3 text-slate-500">{t.dias} días</td>
                    <td className="p-3 font-bold text-sky-600">{t.tasaDia.toFixed(2)} {t.unidad}/día</td>
                    <td className="p-3 font-bold text-slate-800 bg-sky-500/5">{t.tasaMes.toFixed(1)} {t.unidad}/mes</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Two Column Layout for Side-By-Side Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stream Bar chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-600 tracking-wider uppercase">
            Distribución por Corriente
          </h4>
          {corrLabels.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Sin datos de acopio para graficar.</p>
          ) : (
            <div className="space-y-3.5">
              {(() => {
                const maxVal = Math.max(...corrVals, 1);
                return corrLabels.map((label, idx) => {
                  const val = byCorriente[label] || 0;
                  const pct = (val / maxVal) * 100;
                  const col = CHART_COLORS[idx % CHART_COLORS.length];
                  return (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 truncate max-w-[180px]" title={label}>{label}</span>
                        <span className="text-slate-900 font-bold">{val.toLocaleString()} kg</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%`, backgroundColor: col }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

        {/* Category breakdown Pie/Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-600 tracking-wider uppercase">
            Desglose por Categoría Jurídica
          </h4>
          {Object.keys(byCat).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Sin datos para desglosar.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Embedded SVG rendering of pie chart */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {(() => {
                    let totalAngle = 0;
                    return Object.entries(byCat).map(([cat, val]) => {
                      const pct = (val as number) / (totalKg || 1);
                      const strokeDash = pct * 314.15;
                      const strokeOffset = totalAngle * 314.15;
                      totalAngle += pct;
                      const col = CAT_COLOR[cat] || "#94a3b8";
                      return (
                        <circle
                          key={cat}
                          cx="50"
                          cy="50"
                          r="25"
                          fill="transparent"
                          stroke={col}
                          strokeWidth="11"
                          strokeDasharray={`${strokeDash} 314.15`}
                          strokeDashoffset={-strokeOffset}
                        />
                      );
                    });
                  })()}
                  <circle cx="50" cy="50" r="19" fill="#ffffff" />
                </svg>
                <div className="absolute text-center">
                  <div className="text-base font-black text-slate-800 leading-none">
                    {totalKg.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">kg / lt</div>
                </div>
              </div>

              {/* Pie Legends */}
              <div className="space-y-2 flex-1">
                {Object.entries(byCat).map(([cat, val]) => {
                  const pct = Math.round(((val as number) / (totalKg || 1)) * 100);
                  const col = CAT_COLOR[cat] || "#94a3b8";
                  return (
                    <div key={cat} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col }} />
                      <span className="text-slate-600 truncate max-w-[150px]" title={cat}>{cat}</span>
                      <span className="text-slate-800 font-black ml-auto">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Evolution Timeline line chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-600 tracking-wider uppercase">
            Evolución Cronológica de Generaciones
          </h4>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            Historial Mensual
          </span>
        </div>
        
        {monthLabels.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-12">Sin datos históricos suficientes.</p>
        ) : (
          <div className="pt-4 h-48 w-full">
            {(() => {
              const w = 600;
              const h = 150;
              const padL = 40;
              const padR = 20;
              const padT = 15;
              const padB = 25;
              const iw = w - padL - padR;
              const ih = h - padT - padB;
              
              const maxVal = Math.max(...monthVals, 1);
              
              // Calculate mapping coordinates
              const points = monthVals.map((val, idx) => {
                const x = padL + (idx / Math.max(monthLabels.length - 1, 1)) * iw;
                const y = padT + ih - (val / maxVal) * ih;
                return { x, y, val, label: monthLabels[idx] };
              });

              // Create polyline paths
              const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
              const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + ih} L ${points[0].x} ${padT + ih} Z`;

              return (
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2e86c1" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2e86c1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[0, 0.5, 1].map((ratio) => {
                    const y = padT + ih * (1 - ratio);
                    return (
                      <g key={ratio}>
                        <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                        <text x={padL - 8} y={y + 3.5} textAnchor="end" fontSize="9" fill="#94a3b8" className="font-semibold select-none">
                          {Math.round(maxVal * ratio).toLocaleString()}
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw area and line */}
                  <path d={areaPath} fill="url(#areaGrad)" />
                  <path d={linePath} fill="none" stroke="#2e86c1" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />

                  {/* Nodes */}
                  {points.map((p, i) => (
                    <g key={i} className="group">
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#2e86c1" strokeWidth="2" />
                      {/* Tooltip triggers */}
                      <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="#1e293b" className="font-black opacity-0 group-hover:opacity-100 transition-opacity bg-white select-none">
                        {p.val}
                      </text>
                    </g>
                  ))}

                  {/* Bottom Labels */}
                  {points.map((p, i) => (
                    <text key={i} x={p.x} y={h - 6} textAnchor="middle" fontSize="9" fill="#94a3b8" className="font-bold select-none">
                      {p.label.replace("-", "/")}
                    </text>
                  ))}
                </svg>
              );
            })()}
          </div>
        )}
      </div>

    </div>
  );
};
