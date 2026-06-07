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
        "pdfCargado",
        "transportista",
        "patente",
        "fechaTratamiento",
        "pdfCertificadoCargado"
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
    pdfCargado: "Manifiesto pdf",

    // GESTIÓN EXTERNA
    transportista: "Op. transportista",
    patente: "Patente",
    fechaTratamiento: "F. tratamiento",
    pdfCertificadoCargado: "Certificado pdf"
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
      
      {tipo === "externo" && (
        <div className="bg-sky-50 border border-sky-200/80 p-3.5 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 shadow-sm leading-relaxed">
          <span className="text-base select-none">💡</span>
          <p className="m-0 font-medium text-slate-650">
            <strong>Cómo Ver los PDF Subidos:</strong> Esta tabla técnica de trazabilidad contiene {cols.length} columnas. Para acceder a los botones de visualización de <strong>Manifiesto pdf</strong> y <strong>Certificado pdf</strong>, simplemente <strong>deslice la tabla hacia la derecha</strong> (usando la barra de desplazamiento inferior). También puede acceder a ellos y verlos de forma directa ingresando a la nueva sección de <strong>"Documentos"</strong> arriba.
          </p>
        </div>
      )}

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
                              ) : col === "pdfCargado" || col === "pdfCertificadoCargado" ? (
                                val ? (
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setSelectedPdfRow(row);
                                      setSelectedDocType(col === "pdfCargado" ? "manifiesto" : "certificado");
                                    }}
                                    className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer shadow-sm transition-all text-xs"
                                  >
                                    <FileCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                    Subido (Ver)
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-black text-red-500 uppercase tracking-wider bg-red-50/50 border border-red-100 px-2 py-1 rounded-md inline-block">
                                    Pendiente
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

      {/* Simulated Document PDF Viewer Modal */}
      {selectedPdfRow && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[85vh]">
            
            {/* Left Column: Repository document catalog */}
            <div className="w-full md:w-80 bg-slate-100 border-r border-slate-200 flex flex-col min-h-0 bg-gradient-to-b from-slate-50 to-slate-100 flex-shrink-0">
              <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-sky-600" />
                <div>
                  <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider block">REPOSITORIO DIGITAL</span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Documentos cargados sgi</p>
                </div>
              </div>
              
              <div className="p-2.5 space-y-1 overflow-y-auto flex-1">
                {allRepositoryFiles.length === 0 ? (
                  <p className="text-xxs text-slate-400 uppercase font-bold text-center mt-6">No hay documentos cargados</p>
                ) : (
                  allRepositoryFiles.map((file) => {
                    const isSelected = selectedPdfRow.id === file.row.id && selectedDocType === file.type;
                    return (
                      <button
                        key={file.id}
                        onClick={() => {
                          setSelectedPdfRow(file.row);
                          setSelectedDocType(file.type);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-xs ${
                          isSelected
                            ? "bg-sky-600 border-sky-600 text-white shadow-sm font-bold scale-[1.01]"
                            : "bg-white border-slate-200 hover:border-slate-350 text-slate-700"
                        }`}
                      >
                        <FileText className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                        <div className="truncate flex-1 min-w-0">
                          <p className="truncate m-0 leading-tight">{file.title}</p>
                          <span className={`text-[8px] uppercase block mt-0.5 tracking-wider font-bold ${isSelected ? "text-sky-100" : "text-slate-400"}`}>
                            {file.type === "manifiesto" ? "Gestión Interna" : "Gestión Externa"}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: PDF Simulator sheet */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-200">
              {/* Modal Header */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500 animate-pulse" />
                  <span className="font-extrabold text-sm tracking-widest uppercase">
                    VISOR DE {selectedDocType === "manifiesto" ? "MANIFIESTO ELECTRONICO" : "CERTIFICADO DE TRATAMIENTO"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPdfRow(null)}
                  className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Cerrar Repositorio"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Paper Sheets */}
              <div className="p-6 bg-slate-300 flex-1 overflow-y-auto flex justify-center">
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-slate-350 w-full max-w-2xl min-h-[750px] flex flex-col justify-between text-slate-800 relative font-sans">
                  
                  {/* Official watermarks & stamps decoration */}
                  <div className="absolute right-8 top-28 border-4 border-dashed border-emerald-500/30 rounded-full px-4 py-2 rotate-12 text-emerald-500/30 font-black text-xs font-mono select-none pointer-events-none uppercase tracking-widest">
                    SGI REGISTRO CERTIFICADO
                  </div>

                  {/* Simulated Document Header */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b-2 border-slate-850 pb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">Sistema SGI de Residuos</h3>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Control de Trazabilidad y Almacenamiento Transitorio</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xxs uppercase font-mono px-2 py-1 rounded bg-slate-100 text-slate-600 font-bold">Residuos</span>
                        <p className="text-[10px] font-mono mt-1 text-slate-500 font-bold">ID Registro: {selectedPdfRow.id}</p>
                      </div>
                    </div>

                    <div className="text-center py-2 bg-slate-100 border border-slate-200 rounded-lg">
                      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-705">
                        {selectedDocType === "manifiesto" 
                          ? "Manifiesto de Retiro Externo (Gestión Interna)" 
                          : "Certificado de Tratamiento y/o Disposición Final (Gestión Externa)"}
                      </span>
                    </div>
                  </div>

                  {/* Substantive Data Layout */}
                  <div className="my-6 space-y-5 text-xs">
                    
                    {/* Category & Stream block */}
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block border-b pb-1">1. Especificaciones del Residuo</span>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Categoría Legal</span>
                          <p className="font-extrabold text-slate-800 text-xs">{selectedPdfRow.categoria}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Corriente Declarada</span>
                          <p className="font-extrabold text-slate-800 text-xs">{selectedPdfRow.corriente}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Cantidad Declarada</span>
                          <p className="font-extrabold text-slate-850 text-xs">{selectedPdfRow.cantEst || selectedPdfRow.cantidad} {selectedPdfRow.unidad}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Fecha Registro SGI</span>
                          <p className="font-mono font-bold text-slate-700 text-xs">{selectedPdfRow.fecha}</p>
                        </div>
                      </div>
                    </div>

                    {/* 1. GESTIÓN INTERNA */}
                    <div className="bg-sky-50/20 p-4 rounded-xl border border-sky-100/60 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700 block border-b border-sky-100 pb-1">2. Datos de Gestión Interna</span>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">N° de Manifiesto electrónico</span>
                          <p className="font-bold text-sky-950 text-xs">{selectedPdfRow.manifesto || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Fecha Manifiesto</span>
                          <p className="font-mono font-bold text-slate-800 text-xs">{selectedPdfRow.fechaManifiesto || selectedPdfRow.fecha}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Fecha Retiro Ef.</span>
                          <p className="font-mono font-bold text-slate-850 text-xs">{selectedPdfRow.fechaRetiro || selectedPdfRow.fecha}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Embalaje</span>
                          <p className="font-bold text-slate-800 text-xs">{selectedPdfRow.embalaje || "1A1"}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Observaciones de Acopio</span>
                          <p className="font-semibold text-slate-700 text-xs italic">"{selectedPdfRow.observaciones || "S/O"}"</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. GESTIÓN EXTERNA */}
                    <div className="bg-emerald-50/20 p-4 rounded-xl border border-emerald-100/60 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block border-b border-emerald-100 pb-1">3. Datos de Gestión Externa</span>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Operador Transportista</span>
                          <p className="font-bold text-emerald-950 text-xs">{selectedPdfRow.transportista || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Patente vehículo</span>
                          <p className="font-mono font-bold text-slate-800 uppercase tracking-widest bg-white inline-block px-1.5 py-0.5 rounded border border-slate-250 text-xs">{selectedPdfRow.patente || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Fecha de tratamiento</span>
                          <p className="font-mono font-bold text-slate-750 text-xs">{selectedPdfRow.fechaTratamiento || selectedPdfRow.fecha}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-xxs block mb-0.5">Certificado de Tratamiento Estado</span>
                          <p className={`font-bold tracking-wide uppercase text-[10px] inline-block px-2 py-0.5 rounded ${selectedPdfRow.pdfCertificadoCargado ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {selectedPdfRow.pdfCertificadoCargado ? "Subido / Certificado Convalidado" : "Pendiente de Carga"}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Simulated signature & barcode stamp footer */}
                  <div className="border-t border-slate-200 pt-5 mt-auto flex justify-between items-end">
                    <div className="text-left">
                      <div className="text-[7px] font-mono text-slate-450 tracking-tight leading-normal uppercase">
                        CÓDIGO SGI DIGITAL DE AUTORIZACIÓN<br />
                        |||| | | |||| || ||||| ||| ||| | ||||| | ||
                        <span className="block mt-0.5 text-[8px] tracking-[0.22em] font-bold text-slate-650 uppercase">SGI-TRAZA-{selectedPdfRow.id}</span>
                      </div>
                    </div>
                    <div className="text-center w-36 border-t border-slate-300 pt-1">
                      <span className="text-[7px] text-slate-400 block font-bold uppercase tracking-wider">Autoridad de Control</span>
                      <span className="text-[8px] font-extrabold text-slate-700 uppercase tracking-widest block mt-0.5 font-mono">CC-SGI-OK</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Actions */}
              <div className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex gap-3 justify-end flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    alert("Imprimiendo copia del documento del repositorio...");
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-750 hover:border-slate-600 rounded-xl text-xs font-bold font-mono text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 animate-none"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const docName = selectedDocType === "manifiesto" ? `Manifiesto_${selectedPdfRow.manifesto}.pdf` : `Certificado_${selectedPdfRow.transportista}.pdf`;
                    alert(`Descargando copia original desde repositorio: ${docName}`);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-505 hover:bg-emerald-500 rounded-xl text-xs font-bold font-mono text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm animate-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
