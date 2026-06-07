/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { RegistroInterno, RetiroExterno } from "../types";
import { CAT_COLOR, COLORS } from "../constants";
import { exportXLSX, exportPDF } from "../utils";
import { Search, Filter, Download, Edit3, Trash2, ArrowUpDown, Check, X, FileCheck, FileWarning, FileText, Printer, FolderOpen } from "lucide-react";

interface HistorialTableProps {
  data: (RegistroInterno | RetiroExterno)[];
  tipo: "interno" | "externo";
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

export const HistorialTable: React.FC<HistorialTableProps> = ({ data, tipo, setData }) => {
  const [search, setSearch] = useState<string>("");
  const [filterCat, setFilterCat] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("fecha");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<any>(null);
  
  // Repository-based states
  const [selectedPdfRow, setSelectedPdfRow] = useState<any | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<"manifiesto" | "certificado">("manifiesto");
  
  const PER_PAGE = 8;

  const uniqueCats = useMemo(() => {
    return Array.from(new Set(data.map(r => r.categoria)));
  }, [data]);

  // Sorting and Filtering logic
  const filteredData = useMemo(() => {
    let d = [...data];
    
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(r => 
        String(r.corriente).toLowerCase().includes(q) || 
        String(r.categoria).toLowerCase().includes(q) || 
        String(r.fecha).toLowerCase().includes(q) ||
        (r.tipo === "externo" && String((r as any).manifesto).toLowerCase().includes(q)) ||
        (r.tipo === "externo" && String((r as any).transportista).toLowerCase().includes(q)) ||
        (r.tipo === "externo" && String((r as any).patente).toLowerCase().includes(q))
      );
    }
    
    if (filterCat) {
      d = d.filter(r => r.categoria === filterCat);
    }

    // Sort entries
    d.sort((a: any, b: any) => {
      let va = a[sortKey] !== undefined ? a[sortKey] : "";
      let vb = b[sortKey] !== undefined ? b[sortKey] : "";
      
      // Date string sorting adjustments
      if (sortKey === "fecha" || sortKey === "fechaRetiro" || sortKey === "fechaManifiesto" || sortKey === "fechaTratamiento") {
        const parseD = (s: string) => {
          if (!s) return 0;
          const p = s.split("/");
          return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]).getTime() : 0;
        };
        va = parseD(va);
        vb = parseD(vb);
      }

      if (typeof va === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    return d;
  }, [data, search, filterCat, sortKey, sortDir]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PER_PAGE));
  const currentPageData = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredData.slice(start, start + PER_PAGE);
  }, [filteredData, page]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  function handleDelete(id: number) {
    if (window.confirm("¿Confirma que desea eliminar este registro técnico de la base de datos? Esta acción es irreversible.")) {
      setData(prev => prev.filter(r => r.id !== id));
    }
  }

  function startEdit(row: any) {
    setEditId(row.id);
    setEditRow({ ...row });
  }

  function saveEdit() {
    setData(prev => prev.map(r => r.id === editId ? { ...editRow } : r));
    setEditId(null);
    setEditRow(null);
  }

  // Column declarations
  const cols = tipo === "interno" 
    ? ["categoria", "corriente", "fecha", "cantidad", "unidad"]
    : [
        "categoria",
        "corriente",
        "fecha",
        "manifesto",
        "fechaManifiesto",
        "cantEst",
        "unidad",
        "fechaRetiro",
        "embalaje",
        "observaciones",
        "linkManifiesto",
        "sitioDisposicion",
        "transportista",
        "patente",
        "fechaTratamiento",
        "linkCertificado"
      ];

  const colLabel: Record<string, string> = {
    categoria: "Categoría",
    corriente: "Corriente",
    fecha: "F. registro",
    cantidad: "Cantidad",
    unidad: "Unidad",
    
    // GESTIÓN INTERNA
    manifesto: "N° manifiesto",
    fechaManifiesto: "F. manifiesto",
    cantEst: "Cantidad ret.",
    fechaRetiro: "F. retiro",
    embalaje: "Embalaje",
    observaciones: "Observaciones",
    linkManifiesto: "Link a Manifiesto electrónico",

    // GESTIÓN EXTERNA
    sitioDisposicion: "Sitio disp. transitoria",
    transportista: "Op. transportista",
    patente: "Patente",
    fechaTratamiento: "F. tratamiento",
    linkCertificado: "Link a Certificado de Tratamiento y/o Disp.final"
  };

  // Extract all files currently loaded in the repository from previous saves
  const allRepositoryFiles = useMemo(() => {
    const files: { id: number; title: string; filename: string; type: "manifiesto" | "certificado"; row: any }[] = [];
    data.forEach((r: any) => {
      if (r.tipo === "externo") {
        if (r.pdfCargado) {
          files.push({
            id: r.id,
            title: `Manifiesto Electrónico N° ${r.manifesto}`,
            filename: `Manifiesto_${r.manifesto}.pdf`,
            type: "manifiesto",
            row: r
          });
        }
        if (r.pdfCertificadoCargado) {
          files.push({
            id: r.id + 5000000, // keep IDs unique
            title: `Certificado Destino (${r.transportista})`,
            filename: `Certificado_${r.transportista.replace(/\s+/g, "_")}_${r.patente}.pdf`,
            type: "certificado",
            row: r
          });
        }
      }
    });
    return files;
  }, [data]);

  // Document exports call helpers
  const runExportCSV = () => {
    const filename = `control_manifiestos_${tipo}_${new Date().toISOString().slice(0,10)}`;
    const headers = cols.map(c => colLabel[c]);
    exportXLSX(filteredData, headers, cols, filename);
  };

  const runExportTXT = () => {
    const filename = `resumen_${tipo}_${new Date().toISOString().slice(0,10)}`;
    const headers = cols.map(c => colLabel[c]);
    exportPDF(filteredData, headers, cols, filename);
  };

  return (
    <div className="space-y-4">

      {/* Table filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por corriente, transportista, patente..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 hover:border-slate-300 focus:border-sky-500 rounded-xl outline-none transition-colors"
          />
        </div>

        {/* Category selector */}
        <div className="relative min-w-[170px]">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={filterCat}
            onChange={e => { setFilterCat(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 hover:border-slate-300 rounded-xl outline-none bg-white font-semibold text-slate-600 appearance-none cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {uniqueCats.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Action downloads */}
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={runExportCSV}
            className="p-2.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 rounded-xl text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer animate-none"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          
          <button 
            onClick={runExportTXT}
            className="p-2.5 bg-slate-50 text-slate-700 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer animate-none"
          >
            <Download className="w-3.5 h-3.5" />
            TXT
          </button>
        </div>

      </div>

      {/* Grid Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs table-auto">
            <thead>
              <tr className="bg-sky-100 border-b border-sky-200 text-sky-950 select-none">
                {cols.map(col => (
                  <th 
                    key={col} 
                    onClick={() => handleSort(col)}
                    className="p-3 font-bold text-center tracking-wider cursor-pointer hover:bg-sky-200 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{colLabel[col]}</span>
                      <ArrowUpDown className="w-3 h-3 text-sky-500" />
                    </div>
                  </th>
                ))}
                <th className="p-3 font-bold tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((row, idx) => {
                const isEditing = editId === row.id;
                
                return (
                  <tr 
                    key={row.id} 
                    className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                    }`}
                  >
                    {isEditing ? (
                      // Inline edit row input block
                      <>
                        {cols.map((col) => (
                          <td key={col} className="p-1">
                            <input
                              type="text"
                              value={editRow[col] !== undefined ? editRow[col] : ""}
                              onChange={e => setEditRow({ ...editRow, [col]: e.target.value })}
                              className="w-full border border-sky-400 p-1.5 text-xs rounded-lg outline-none bg-sky-50/30"
                            />
                          </td>
                        ))}
                        <td className="p-1 text-right whitespace-nowrap">
                          <div className="flex gap-1 justify-end">
                            <button 
                              onClick={saveEdit}
                              className="p-1 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 cursor-pointer"
                              title="Guardar"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => { setEditId(null); setEditRow(null); }}
                              className="p-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 cursor-pointer"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Standard Row render block
                      <>
                        {cols.map((col) => {
                          const val = (row as any)[col];
                          
                          return (
                            <td key={col} className="p-3.5 text-slate-800 align-middle">
                              {col === "categoria" ? (
                                <span 
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-transparent tracking-wide inline-block whitespace-nowrap"
                                  style={{ 
                                    backgroundColor: `${CAT_COLOR[val]}12`, 
                                    color: CAT_COLOR[val],
                                    borderColor: `${CAT_COLOR[val]}30`
                                  }}
                                >
                                  {val}
                                </span>
                              ) : col === "linkManifiesto" || col === "linkCertificado" ? (
                                val ? (
                                  <a 
                                    href={val.startsWith("http") ? val : `https://${val}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-600 hover:text-sky-800 hover:underline font-semibold block max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap"
                                    title={val}
                                  >
                                    {val}
                                  </a>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-400 italic bg-slate-50 border border-slate-100 px-2 py-1 rounded-md inline-block">
                                    No provisto
                                  </span>
                                )
                              ) : (
                                <span className="font-semibold text-slate-700 block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={val}>
                                  {val || "N/A"}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        
                        {/* Interactive columns action triggers */}
                        <td className="p-3.5 text-right align-middle pr-6 whitespace-nowrap">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              className="p-1 px-2 border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-500 hover:text-sky-750 rounded-lg cursor-pointer transition-all"
                              title="Editar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row.id)}
                              className="p-1 px-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-750 rounded-lg cursor-pointer transition-all"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              
              {currentPageData.length === 0 && (
                <tr>
                  <td colSpan={cols.length + 1} className="p-12 text-center text-slate-400 font-medium text-sm">
                    No se encontraron registros de residuos bajo los criterios ingresados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination list indicators */}
      <div className="flex justify-between items-center text-xs text-slate-400 font-semibold px-2 uppercase tracking-wide">
        <span>{filteredData.length} registros en total</span>
        
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                p === page 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                  : "bg-white border-slate-300 hover:bg-slate-50 text-slate-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
