/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2, AlertOctagon, HelpCircle, FileText, Upload, Trash2, Truck, Server } from "lucide-react";
import { CategoriaResiduo } from "../types";
import { DateInput } from "./DateInput";
import { CORRIENTES, UNIDADES, UNIDAD_HABITUAL, CAT_COLOR, COLORS } from "../constants";
import { today, parseDate } from "../utils";

interface RetiroExternoFormProps {
  setScreen: (screen: "home" | "interno" | "externo" | "panel") => void;
  onSave: (retiro: {
    categoria: CategoriaResiduo;
    corriente: string;
    fecha: string;
    
    // GESTIÓN INTERNA
    manifesto: string;
    fechaManifiesto: string;
    cantEst: string;
    unidad: string;
    fechaRetiro: string;
    embalaje: string;
    observaciones: string;
    pdfCargado: boolean;

    // GESTIÓN EXTERNA
    transportista: string;
    patente: string;
    fechaTratamiento: string;
    pdfCertificadoCargado: boolean;
  }) => void;
}

export const RetiroExternoForm: React.FC<RetiroExternoFormProps> = ({ setScreen, onSave }) => {
  const [categoria, setCat] = useState<CategoriaResiduo | "">("");
  const [corriente, setCor] = useState<string>("");
  const [fecha, setFecha] = useState<string>(today()); // general declaration or log date
  
  // GESTIÓN INTERNA
  const [manifesto, setMan] = useState<string>(""); 
  const [fechaManifiesto, setFechaManifiesto] = useState<string>(today());
  const [cantEst, setCant] = useState<string>(""); 
  const [unidad, setUni] = useState<string>("Kilogramos");
  const [unidadCustom, setUC] = useState<string>("");
  const [fechaRetiro, setFR] = useState<string>(today());
  const [embalaje, setEmbalaje] = useState<string>("1A1");
  const [embalajeCustom, setEmbalajeCustom] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [pdfCargado, setPdf] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // GESTIÓN EXTERNA
  const [transportista, setTr] = useState<string>("IDM S.A.");
  const [transportistaCustom, setTrCustom] = useState<string>("");
  const [patente, setPat] = useState<string>("");
  const [fechaTratamiento, setFechaTratamiento] = useState<string>(today());
  const [pdfCertificadoCargado, setPdfCert] = useState<boolean>(false);
  const [dragActiveCert, setDragActiveCert] = useState<boolean>(false);

  const [saved, setSaved] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const corrientes = categoria ? CORRIENTES[categoria] : [];
  
  const unidadFinal = unidad === "Otra" ? unidadCustom : unidad;
  const embalajeFinal = embalaje === "Otros" ? embalajeCustom : embalaje;
  const transportistaFinal = transportista === "Otros" ? transportistaCustom : transportista;

  const habitual = corriente ? UNIDAD_HABITUAL[corriente] : null;
  const showWarn = 
    habitual && 
    unidadFinal && 
    unidadFinal !== habitual && 
    categoria !== "Residuos Peligrosos";

  const isPdfRequired = false;

  function validate() {
    const e: Record<string, string> = {};
    if (!categoria) e.categoria = "Debe clasificar la categoría.";
    if (!corriente) e.corriente = "Especifique el residuo retirado.";
    
    if (!cantEst.trim()) {
      e.cantEst = "Cantidad es requerida.";
    }

    if (!manifesto.trim()) {
      e.manifesto = "N° de Manifiesto electrónico es requerido.";
    }
    
    const parsedFecha = parseDate(fecha);
    if (!fecha || fecha.includes("_") || !parsedFecha) {
      e.fecha = "Ingrese una fecha técnica válida.";
    }

    const parsedMan = parseDate(fechaManifiesto);
    if (!fechaManifiesto || fechaManifiesto.includes("_") || !parsedMan) {
      e.fechaManifiesto = "Ingrese una fecha de manifiesto válida.";
    }

    const parsedRetiro = parseDate(fechaRetiro);
    if (!fechaRetiro || fechaRetiro.includes("_") || !parsedRetiro) {
      e.fechaRetiro = "Ingrese una fecha de retiro válida.";
    }

    const parsedTrat = parseDate(fechaTratamiento);
    if (!fechaTratamiento || fechaTratamiento.includes("_") || !parsedTrat) {
      e.fechaTratamiento = "Ingrese una fecha de tratamiento válida.";
    }

    if (unidad === "Otra" && !unidadCustom.trim()) {
      e.unidad = "Especifique la unidad.";
    }

    if (embalaje === "Otros" && !embalajeCustom.trim()) {
      e.embalaje = "Especifique el tipo de embalaje.";
    }

    if (transportista === "Otros" && !transportistaCustom.trim()) {
      e.transportista = "Especifique el operador transportista.";
    }

    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // Scroll to top of errors to guide user
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    onSave({
      categoria: categoria as CategoriaResiduo,
      corriente,
      fecha,

      // GESTIÓN INTERNA
      manifesto,
      fechaManifiesto,
      cantEst,
      unidad: unidadFinal,
      fechaRetiro,
      embalaje: embalajeFinal,
      observaciones: observaciones || "Ninguna",
      pdfCargado,

      // GESTIÓN EXTERNA
      transportista: transportistaFinal,
      patente: patente || "Sin especificar",
      fechaTratamiento,
      pdfCertificadoCargado
    });

    setSaved(true);
    setErrors({});

    setTimeout(() => {
      setSaved(false);
      setCat("");
      setCor("");
      setFecha(today());
      setMan("");
      setFechaManifiesto(today());
      setCant("");
      setUni("Kilogramos");
      setUC("");
      setFR(today());
      setEmbalaje("1A1");
      setEmbalajeCustom("");
      setObservaciones("");
      setPdf(false);
      
      setTr("IDM S.A.");
      setTrCustom("");
      setPat("");
      setFechaTratamiento(today());
      setPdfCert(false);
    }, 2000);
  }

  // Drag and drop for Manifest PDF
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setPdf(true);
        setErrors(prev => ({ ...prev, pdf: "" }));
      }
    }
  };

  // Drag and drop for Certificate PDF
  const handleDragCert = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveCert(true);
    } else if (e.type === "dragleave") {
      setDragActiveCert(false);
    }
  };

  const handleDropCert = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveCert(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setPdfCert(true);
        setErrors(prev => ({ ...prev, pdfCert: "" }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <div className="max-w-2xl w-full mx-auto bg-sky-50 border border-sky-250 shadow-xl rounded-2xl overflow-hidden self-center">
        
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
              <h2 className="text-xl font-black tracking-wider m-0 uppercase">REGISTRO DE RETIRO EXTERNO</h2>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Trazabilidad de Despachos SGI</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <Truck className="w-5 h-5 text-sky-400" />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">

          {/* BASIC COMMON FIELDS: CATEGORY & STREAM */}
          <div className="p-4 bg-sky-100/40 border border-sky-200/85 rounded-xl space-y-4">
            <div className="text-xs font-black text-slate-800 uppercase tracking-widest pl-1">
              Clasificación del Residuo
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                Categoría
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {["Residuos Peligrosos", "Residuos Industriales No Peligrosos", "NFU"].map((cat) => {
                  const color = CAT_COLOR[cat];
                  const active = categoria === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCat(cat as CategoriaResiduo);
                        setCor("");
                        setErrors(prev => ({ ...prev, categoria: "" }));
                      }}
                      className={`text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 flex items-center justify-between ${
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
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    </button>
                  );
                })}
              </div>
              {errors.categoria && (
                <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  {errors.categoria}
                </p>
              )}
            </div>

            {categoria && (
              <FLabel label="Detalle de Corriente" error={errors.corriente}>
                <select
                  value={corriente}
                  onChange={(e) => {
                    setCor(e.target.value);
                    setErrors(prev => ({ ...prev, corriente: "" }));
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500 outline-none"
                >
                  <option value="">-- Seleccionar Corriente --</option>
                  {corrientes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FLabel>
            )}

            <div className="space-y-4">
              <FLabel label="Fecha Declaración General" error={errors.fecha}>
                <DateInput value={fecha} onChange={setFecha} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500" />
              </FLabel>
            </div>
          </div>

          {/* 1. GESTIÓN INTERNA */}
          <div className="border border-sky-200 rounded-2xl p-5 bg-sky-100/50 space-y-5">
            <div className="flex items-center gap-2 border-b border-sky-100/60 pb-3">
              <Server className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-black text-sky-950 uppercase tracking-wider">GESTIÓN INTERNA</h3>
            </div>

            <div className="space-y-4">
              <FLabel label="N° de Manifiesto electrónico" error={errors.manifesto}>
                <input
                  type="text"
                  placeholder="Escriba el N° de manifiesto"
                  value={manifesto}
                  onChange={e => {
                    setMan(e.target.value);
                    setErrors(prev => ({ ...prev, manifesto: "" }));
                  }}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 outline-none bg-white"
                />
              </FLabel>

              <FLabel label="Fecha Manifiesto" error={errors.fechaManifiesto}>
                <DateInput value={fechaManifiesto} onChange={setFechaManifiesto} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500" />
              </FLabel>
            </div>

            <div className="space-y-4">
              <FLabel label="Cantidad" error={errors.cantEst}>
                <input
                  type="text"
                  placeholder="Ingrese cantidad (campo libre)"
                  value={cantEst}
                  onChange={e => {
                    setCant(e.target.value);
                    setErrors(prev => ({ ...prev, cantEst: "" }));
                  }}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 outline-none bg-white"
                />
              </FLabel>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">Unidad de Medida</label>
                <div className="flex flex-wrap gap-1.5">
                  {[...UNIDADES, "Otra"].map((u) => {
                    const active = unidad === u;
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUni(u)}
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
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
                  <input
                    type="text"
                    placeholder="Especifique unidad (ej. Contenedor)"
                    value={unidadCustom}
                    onChange={e => setUC(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-sky-500 mt-2 bg-white"
                  />
                )}
                {errors.unidad && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {errors.unidad}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <FLabel label="Fecha de Retiro" error={errors.fechaRetiro}>
                <DateInput value={fechaRetiro} onChange={setFR} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500 text-slate-800" />
              </FLabel>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">Embalaje</label>
                <select
                  value={embalaje}
                  onChange={e => {
                    setEmbalaje(e.target.value);
                    setEmbalajeCustom("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-sky-500 outline-none font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="1A1">1A1</option>
                  <option value="granel">granel</option>
                  <option value="Otros">Otros</option>
                </select>

                {embalaje === "Otros" && (
                  <input
                    type="text"
                    placeholder="Escriba el tipo de embalaje"
                    value={embalajeCustom}
                    onChange={e => setEmbalajeCustom(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-sky-500 mt-2 bg-white"
                  />
                )}
                {errors.embalaje && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {errors.embalaje}
                  </p>
                )}
              </div>
            </div>

            <FLabel label="Observaciones">
              <textarea
                placeholder="Observaciones de la gestión interna..."
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-sky-500 outline-none bg-white font-sans"
              />
            </FLabel>

            {showWarn && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex gap-2 items-center">
                <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Control de Unidad: La unidad de medida para <strong>{corriente}</strong> suele ser <strong>{habitual}</strong>.
                </span>
              </div>
            )}

            {/* Simulated File Upload Drag/Drop zone - Manifest */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                Manifiesto electrónico (PDF) {isPdfRequired && <span className="text-amber-600 font-semibold">(Obligatorio p/ Peligrosos)</span>}
              </label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  pdfCargado 
                    ? "border-emerald-400 bg-emerald-50/20 text-emerald-800" 
                    : dragActive 
                    ? "border-sky-500 bg-sky-50/50 text-sky-800" 
                    : "border-slate-300 hover:border-slate-400 bg-slate-50/20 text-slate-600"
                }`}
              >
                {pdfCargado ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <FileText className="w-7 h-7 text-emerald-500" />
                    <div className="text-xs font-bold uppercase tracking-wider">Manifiesto_Cargado.pdf</div>
                    <button 
                      type="button"
                      onClick={() => setPdf(false)}
                      className="text-xs text-red-500 mt-1 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Quitar Documento
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <Upload className={`w-7 h-7 ${dragActive ? "text-sky-500 animate-bounce" : "text-slate-400"}`} />
                    <span className="text-xs font-bold text-slate-700">Arrastre aquí el archivo PDF del manifiesto</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">o haga clic para seleccionar</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          setPdf(true);
                          setErrors(prev => ({ ...prev, pdf: "" }));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              {errors.pdf && (
                <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.pdf}
                </p>
              )}
            </div>
          </div>

          {/* 2. GESTIÓN EXTERNA */}
          <div className="border border-sky-200 rounded-2xl p-5 bg-sky-100/50 space-y-5">
            <div className="flex items-center gap-2 border-b border-emerald-100/60 pb-3">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">GESTIÓN EXTERNA</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">Operador Transportista</label>
                <select
                  value={transportista}
                  onChange={e => {
                    setTr(e.target.value);
                    setTrCustom("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-sky-500 outline-none font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="IDM S.A.">IDM S.A.</option>
                  <option value="Bravo Energy">Bravo Energy</option>
                  <option value="PELCO">PELCO</option>
                  <option value="Otros">Otros</option>
                </select>

                {transportista === "Otros" && (
                  <input
                    type="text"
                    placeholder="Escriba el nombre del operador transportista"
                    value={transportistaCustom}
                    onChange={e => setTrCustom(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-sky-500 mt-2 bg-white"
                  />
                )}
                {errors.transportista && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {errors.transportista}
                  </p>
                )}
              </div>

              <FLabel label="Patente vehículo" error={errors.patente}>
                <input
                  type="text"
                  placeholder="Ingrese patente"
                  value={patente}
                  onChange={e => {
                    setPat(e.target.value);
                    setErrors(prev => ({ ...prev, patente: "" }));
                  }}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 outline-none bg-white font-mono uppercase"
                />
              </FLabel>
            </div>

            <div className="space-y-4">
              <FLabel label="Fecha de tratamiento" error={errors.fechaTratamiento}>
                <DateInput value={fechaTratamiento} onChange={setFechaTratamiento} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-sky-500" />
              </FLabel>
            </div>

            {/* Simulated File Upload Drag/Drop zone - Certificate */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                Certificado de Tratamiento y/o Disp.final (PDF)
              </label>
              <div
                onDragEnter={handleDragCert}
                onDragOver={handleDragCert}
                onDragLeave={handleDragCert}
                onDrop={handleDropCert}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  pdfCertificadoCargado 
                    ? "border-emerald-400 bg-emerald-50/20 text-emerald-800" 
                    : dragActiveCert 
                    ? "border-sky-500 bg-sky-50/50 text-sky-800" 
                    : "border-slate-300 hover:border-slate-400 bg-slate-50/20 text-slate-600"
                }`}
              >
                {pdfCertificadoCargado ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <FileText className="w-7 h-7 text-emerald-500" />
                    <div className="text-xs font-bold uppercase tracking-wider">Certificado_Cargado.pdf</div>
                    <button 
                      type="button"
                      onClick={() => setPdfCert(false)}
                      className="text-xs text-red-500 mt-1 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Quitar Certificado
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <Upload className={`w-7 h-7 ${dragActiveCert ? "text-sky-500 animate-bounce" : "text-slate-400"}`} />
                    <span className="text-xs font-bold text-slate-700">Arrastre aquí el archivo PDF del certificado</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">o haga clic para seleccionar</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          setPdfCert(true);
                          setErrors(prev => ({ ...prev, pdfCert: "" }));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <button
            type="button"
            disabled={saved}
            onClick={handleSave}
            className={`w-full py-4 px-4 rounded-xl font-bold uppercase tracking-wider text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
              "Asentar Retiro Externo (Manifiesto y Certificado)"
            )}
          </button>

        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-4">
        Asignación de Certificación de Control Ambiental
      </p>
    </div>
  );
};

// Internal input labeling wrapper
const FLabel: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-0.5">
          <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
