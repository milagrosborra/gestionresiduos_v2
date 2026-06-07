/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Library, BarChart4, AlertTriangle, ShieldAlert, FileMinus, FileText, X, Printer, Download, FolderOpen } from "lucide-react";
import { RegistroInterno, RetiroExterno, AlertaAlmacenamiento } from "../types";
import { HistorialTable } from "./HistorialTable";
import { DashboardCharts } from "./DashboardCharts";
import { CAT_COLOR } from "../constants";

interface PanelControlProps {
  setScreen: (screen: "home" | "interno" | "externo" | "panel") => void;
  registros: RegistroInterno[];
  retiros: RetiroExterno[];
  setRegistros: React.Dispatch<React.SetStateAction<RegistroInterno[]>>;
  setRetiros: React.Dispatch<React.SetStateAction<RetiroExterno[]>>;
  alerts: AlertaAlmacenamiento[];
}

export const PanelControl: React.FC<PanelControlProps> = ({
  setScreen,
  registros,
  retiros,
  setRegistros,
  setRetiros,
  alerts
}) => {
  const [tab, setTab] = useState<"interno" | "externo">("interno");
  const [subTab, setSubTab] = useState<"historial" | "dashboard">("historial");

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 selection:bg-sky-500 selection:text-white">
      
      {/* Upper Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setScreen("home")}
              className="text-slate-400 hover:text-white mr-1 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black tracking-wider m-0 uppercase">PANEL DE CONTROL Y TRAZABILIDAD</h2>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Consola de Control Ambiental</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-xxs text-slate-400 font-bold uppercase tracking-widest leading-none">Simulación Establecida</p>
            <p className="text-xs font-mono font-bold text-sky-400 mt-1 leading-none">06/06/2026</p>
          </div>
        </div>
      </div>

      {/* Main Panel Content Container */}
      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6">

        {/* Operational Filters Tab togglers: GENERACION VS DESPACHO */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
          
          {/* Main Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => { 
                setTab("interno"); 
                setPageToOne(); 
              }}
              className={`flex-1 sm:flex-initial text-center px-5 py-2.5 rounded-lg text-xs font-bold transition-all tracking-wide cursor-pointer ${
                tab === "interno" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Registro de acopio interno
            </button>
            <button
              onClick={() => { setTab("externo"); setPageToOne(); }}
              className={`flex-1 sm:flex-initial text-center px-5 py-2.5 rounded-lg text-xs font-bold transition-all tracking-wide cursor-pointer ${
                tab === "externo" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Retiro externo
            </button>
          </div>

          {/* Sub Tabs: LISTING VS CHARTS */}
          <div className="flex gap-1.5 shrink-0 bg-slate-100/60 p-1 rounded-xl">
            <button
              onClick={() => setSubTab("historial")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                subTab === "historial" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              Historia
            </button>
            <button
              onClick={() => setSubTab("dashboard")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                subTab === "dashboard" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <BarChart4 className="w-3.5 h-3.5" />
              Indicadores
            </button>
          </div>

        </div>

        {/* Selected Area Content view render */}
        <motion.div
          key={`${tab}-${subTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-[400px]"
        >
          {subTab === "historial" ? (
            <HistorialTable
              data={tab === "interno" ? registros : retiros}
              tipo={tab}
              setData={tab === "interno" ? setRegistros : setRetiros}
            />
          ) : (
            <DashboardCharts
              registros={registros}
              retiros={retiros}
              tipo={tab}
            />
          )}
        </motion.div>

      </div>

    </div>
  );

  function setPageToOne() {
    // helper to clean internal counters, triggered as a standard action within child inputs
  }
};
