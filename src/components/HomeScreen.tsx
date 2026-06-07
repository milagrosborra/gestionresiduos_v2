/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ClipboardList, Truck, Landmark, AlertTriangle, ShieldAlert, Leaf, BookOpen, Github } from "lucide-react";
import { AlertaAlmacenamiento } from "../types";

interface HomeScreenProps {
  setScreen: (screen: "home" | "interno" | "externo" | "panel" | "contacto") => void;
  alerts: AlertaAlmacenamiento[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen, alerts }) => {
  return (
    <div className="min-h-screen bg-[#eef4fa] text-slate-800 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Decorative environment accent lines */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-sky-500 to-emerald-500" />
      
      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        
        {/* Elegant Minimalist Title Area */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 flex flex-col items-center justify-center pt-2"
        >
          {/* Elegant Circular Leaf Icon Badge */}
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20 text-emerald-600 shadow-sm">
            <Leaf className="w-9 h-9" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-sans font-black tracking-tight text-[#2d6639] m-0 mb-3 leading-none">
            Residuos
          </h1>
          <div className="bg-[#4e8e5d] text-white px-5 py-2 rounded-full shadow-sm border border-[#3e744a]">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase block text-center">
              Sistema de Gestión Integral
            </span>
          </div>
        </motion.div>
        
        {/* Establishments short description below */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-10 max-w-xl mx-auto"
        >
          <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed m-0">
            Control de acopios, trazabilidad de fletes y cumplimiento de plazos legales de almacenamiento transitorio.
          </p>
        </motion.div>

        {/* Regulatory Warnings Block */}
        {alerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-10 max-w-3xl mx-auto w-full space-y-3"
          >
            <div className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 animate-pulse text-red-600" />
              Notificaciones de Vencimientos Relativas a Residuos Peligrosos (Límite Legal: 24 Meses)
            </div>
            
            {alerts.map((al) => (
              <div 
                key={al.id} 
                className={`flex gap-4 items-start p-4 rounded-xl border text-sm backdrop-blur-sm transition-all ${
                  al.level === "critica" 
                    ? "bg-red-50 border-red-200 text-red-950 shadow-sm" 
                    : "bg-amber-50 border-amber-200 text-amber-950 shadow-sm"
                }`}
              >
                <div className="p-1 rounded-lg bg-black/5 mt-0.5">
                  <AlertTriangle className={`w-5 h-5 ${al.level === "critica" ? "text-red-600" : "text-amber-600"}`} />
                </div>
                <div className="flex-1">
                  <div className="font-bold flex items-center gap-2">
                    <span>{al.corriente} · {al.level === "critica" ? "ALERTA CRÍTICA" : "ALERTA PREVENTIVA"}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 font-mono">
                      {al.months} meses acopiado
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    Residuo registrado el <strong className="font-semibold text-slate-900">{al.fecha}</strong> para la categoría <span className="underline italic">{al.categoria}</span>. Requiere retiro y tratamiento urgente antes de infringir la normativa vigente.
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Bento Grid Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full mb-4">
          
          {/* Action 1: Registro Interno */}
          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setScreen("interno")}
            className="flex flex-col justify-between p-6 text-center items-center rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 shadow-md transition-all duration-200 cursor-pointer min-h-[250px]"
          >
            <div className="p-3 bg-sky-100 rounded-xl border border-sky-200 text-sky-600 mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-base font-extrabold text-[#2d6639] mb-2 tracking-tight uppercase text-center w-full">REGISTRO INTERNO</h3>
              <p className="text-[11px] text-slate-600 leading-normal text-center">
                Declare generación de residuos, corrientes acopiadas de forma local y stock en almacén transitorio.
              </p>
            </div>
            <span className="text-xs font-bold text-sky-700 hover:underline mt-4 uppercase tracking-wider">&rarr; Cargar Generación &larr;</span>
          </motion.button>

          {/* Action 2: Retiro Externo */}
          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setScreen("externo")}
            className="flex flex-col justify-between p-6 text-center items-center rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 shadow-md transition-all duration-200 cursor-pointer min-h-[250px]"
          >
            <div className="p-3 bg-sky-100 rounded-xl border border-sky-200 text-sky-600 mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-base font-extrabold text-[#2d6639] mb-2 tracking-tight uppercase text-center w-full">RETIRO EXTERNO</h3>
              <p className="text-[11px] text-slate-600 leading-normal text-center">
                Asiente despachos y fletes de carga por operadores externos, cargando patentes, choferes y manifiestos de transporte.
              </p>
            </div>
            <span className="text-xs font-bold text-sky-700 hover:underline mt-4 uppercase tracking-wider">&rarr; Registrar Retiro &larr;</span>
          </motion.button>

          {/* Action 3: Panel de Control */}
          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setScreen("panel")}
            className="flex flex-col justify-between p-6 text-center items-center rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 shadow-md transition-all duration-200 cursor-pointer min-h-[250px]"
          >
            <div className="p-3 bg-sky-100 rounded-xl border border-sky-200 text-sky-600 mb-3">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-base font-extrabold text-[#2d6639] mb-2 tracking-tight uppercase text-center w-full">PANEL DE CONTROL</h3>
              <p className="text-[11px] text-slate-600 leading-normal text-center">
                Visualice informes ambientales mensuales, verifique tasas de generación promedio e imprima reportes oficiales.
              </p>
            </div>
            <span className="text-xs font-bold text-sky-700 hover:underline mt-4 uppercase tracking-wider">&rarr; Ver Indicadores &larr;</span>
          </motion.button>

          {/* Action 4: Información de Contacto */}
          <motion.button
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setScreen("contacto")}
            className="flex flex-col justify-between p-6 text-center items-center rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 shadow-md transition-all duration-200 cursor-pointer min-h-[250px]"
          >
            <div className="p-3 bg-sky-100 rounded-xl border border-sky-200 text-sky-600 mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="w-full">
              <h3 className="text-base font-extrabold text-[#2d6639] mb-2 tracking-tight uppercase text-center w-full">INFORMACIÓN DE CONTACTO</h3>
              <p className="text-[11px] text-slate-600 leading-normal text-center">
                Consulte el directorio de operadores homologados, instructivos, accesos a portales y datos de contacto de referencia.
              </p>
            </div>
            <span className="text-xs font-bold text-sky-700 hover:underline mt-4 uppercase tracking-wider">&rarr; Directorio y Guías &larr;</span>
          </motion.button>

        </div>

      </div>

      {/* Footer Branding Area */}
      <footer className="py-6 border-t border-slate-200 bg-white/40 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-1.5">
        <p className="m-0 font-semibold text-slate-705 uppercase tracking-wider">Sistema de Gestión Integral &copy; 2026</p>
        <p className="text-[10px] m-0">Control de Trazabilidad y Almacenamiento Transitorio de Residuos</p>
        <div className="flex items-center gap-2 mt-1 text-slate-400">
          <Github className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] font-medium text-slate-550 select-none">Repositorio sincronizado con GitHub</span>
        </div>
      </footer>
    </div>
  );
};
