/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react";
import { ParametrosPopUp } from "./ParametrosPopUp";
import { CategoriaResiduo } from "../types";
import { DateInput } from "./DateInput";
import { CORRIENTES, UNIDADES, UNIDAD_HABITUAL, CAT_COLOR, COLORS } from "../constants";
import { today, parseDate } from "../utils";

interface RegistroInternoFormProps {
  setScreen: (screen: "home" | "interno" | "externo" | "panel") => void;
  onSave: (registro: {
    categoria: CategoriaResiduo;
    corriente: string;
    fecha: string;
    cantidad: number;
    unidad: string;
  }) => void;
}

export const RegistroInternoForm: React.FC<RegistroInternoFormProps> = ({ setScreen, onSave }) => {
  const [categoria, setCat] = useState<CategoriaResiduo | "">("");
  const [corriente, setCor] = useState<string>("");
  const [fecha, setFecha] = useState<string>(today());
  const [cantidad, setCant] = useState<string>("");
  const [unidad, setUni] = useState<string>("Kilogramos");
  const [unidadCustom, setUC] = useState<string>("");
  
  const [saved, setSaved] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const corrientes = categoria ? CORRIENTES[categoria] : [];
  const unidadFinal = unidad === "Otra" ? unidadCustom : unidad;
  const habitual = corriente ? UNIDAD_HABITUAL[corriente] : null;
  
  // Flag warnings for unit parameter anomalies
  const showWarn = 
    habitual && 
    unidadFinal && 
    unidadFinal !== habitual && 
    categoria !== "Residuos Peligrosos";

  function validate() {
    const e: Record<string, string> = {};
    if (!categoria) e.categoria = "Debe seleccionar la categoría del residuo.";
    if (!corriente) e.corriente = "Obligatorio. Seleccione la corriente ambiental correspondiente.";
    
    const parsed = parseDate(fecha);
    if (!fecha || fecha.includes("_") || !parsed) {
      e.fecha = "Ingrese una fecha válida completa en formato DD/MM/AAAA.";
    }
    
    if (!cantidad || isNaN(BigDecimal(cantidad)) || BigDecimal(cantidad) <= 0) {
      e.cantidad = "Ingrese una cantidad numérica estrictamente positiva.";
    }
    
    if (unidad === "Otra" && !unidadCustom.trim()) {
      e.unidad = "Especifique el nombre de la unidad alternativa.";
    }
    
    return e;
  }

  function BigDecimal(strVal: string): number {
    return parseFloat(strVal);
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // scroll to top or first error
      return;
    }
    
    onSave({
      categoria: categoria as CategoriaResiduo,
      corriente,
      fecha,
      cantidad: BigDecimal(cantidad),
      unidad: unidadFinal
    });
    
    setSaved(true);
    setErrors({});
    
    // Reset form after a nice timeout
    setTimeout(() => {
      setSaved(false);
      setCat("");
      setCor("");
      setCant("");
      setUni("Kilogramos");
      setUC("");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <div className="max-w-xl w-full mx-auto bg-sky-50 border border-sky-250 shadow-xl rounded-2xl overflow-hidden self-center">
        
         {/* Form header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setScreen("home")}
              className="text-slate-400 hover:text-white mr-1 transition-colors p-1 hover:bg-slate-800 rounded-lg"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black tracking-wider m-0 uppercase flex items-center gap-1.5">REGISTRO DE ACOPIO INTERNO</h2>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Generación Local</p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${categoria ? "animate-pulse" : ""}`} style={{ backgroundColor: categoria ? CAT_COLOR[categoria] : "#94a3b8" }} />
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          
          {/* Subtitle capsule */}
          <div className="p-2.5 bg-sky-50 border border-sky-101 rounded-xl flex flex-col gap-2">
            <span className="text-xs font-black text-sky-800 uppercase tracking-widest pl-1">
              Datos del Residuo
            </span>
            <ParametrosPopUp />
          </div>
          
          {/* Category Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
              1. Categoría de Residuo
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {(Object.keys(CORRIENTES) as CategoriaResiduo[]).map((cat) => {
                const color = CAT_COLOR[cat];
                const active = categoria === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCat(cat);
                      setCor("");
                      setErrors(prev => ({ ...prev, categoria: "" }));
                    }}
                    className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-150 flex items-center justify-between ${
                      active 
                        ? "shadow-sm border-2 font-bold" 
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                    style={{ 
                      borderColor: active ? color : undefined,
                      color: active ? color : undefined,
                      backgroundColor: active ? `${color}10` : undefined
                    }}
                  >
                    <span>{cat}</span>
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                  </button>
                );
              })}
            </div>
            {errors.categoria && (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.categoria}
              </p>
            )}
          </div>

          <AnimatePresence>
            {categoria && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 overflow-hidden"
              >
                
                {/* Stream selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                    2. Corriente
                  </label>
                  <select
                    value={corriente}
                    onChange={(e) => {
                      setCor(e.target.value);
                      setErrors(prev => ({ ...prev, corriente: "" }));
                    }}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none bg-white font-medium"
                  >
                    <option value="">-- Seleccionar Corriente --</option>
                    {corrientes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.corriente && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.corriente}
                    </p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                    3. Fecha de Generación
                  </label>
                  <DateInput
                    value={fecha}
                    onChange={(v) => {
                      setFecha(v);
                      setErrors(prev => ({ ...prev, fecha: "" }));
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                  {errors.fecha && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.fecha}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1">Formato: Día/Mes/Año</p>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                    4. Cantidad
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ej. 145.5"
                    value={cantidad}
                    onChange={(e) => {
                      setCant(e.target.value);
                      setErrors(prev => ({ ...prev, cantidad: "" }));
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                  {errors.cantidad && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.cantidad}
                    </p>
                  )}
                </div>

                {/* Metric Unit pills */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                    5. Unidad de Medida
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[...UNIDADES, "Otra"].map((u) => {
                      const active = unidad === u;
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => {
                            setUni(u);
                            setErrors(prev => ({ ...prev, unidad: "" }));
                          }}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            active 
                              ? "bg-slate-900 border-slate-900 text-white font-bold" 
                              : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {u}
                        </button>
                      );
                    })}
                  </div>
                  
                  {unidad === "Otra" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2"
                    >
                      <input
                        type="text"
                        placeholder="Especifique unidad (ej: Tambor de 200L, Pallet)"
                        value={unidadCustom}
                        onChange={(e) => setUC(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </motion.div>
                  )}
                  
                  {errors.unidad && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.unidad}
                    </p>
                  )}

                  {/* Habitual warning tooltips */}
                  {showWarn && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex gap-2 items-center"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>
                        Control sugerido: La unidad de medida habitual declarada para la corriente <strong>{corriente}</strong> es <strong>{habitual}</strong>. Verifique si corresponde adaptarlo.
                      </span>
                    </motion.div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Action button */}
          <button
            type="button"
            disabled={saved}
            onClick={handleSave}
            className={`w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              saved 
                ? "bg-emerald-600 text-white" 
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                ¡Registro Guardado con Éxito!
              </>
            ) : (
              "Asentar Registro de Acopio"
            )}
          </button>

        </div>
      </div>
      
      {/* Small informative Footer */}
      <p className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-4">
        Asignación de Stock de Almacenamiento Transitorio Interno
      </p>
    </div>
  );
};
