import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Users, 
  Truck, 
  Sliders, 
  Phone, 
  Mail, 
  ExternalLink, 
  Lock, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  Info
} from "lucide-react";

interface InformacionContactoProps {
  setScreen: (screen: "home" | "interno" | "externo" | "panel" | "contacto") => void;
}

type OperatorCategory = "NFU" | "RINP" | "Peligrosos";

export const InformacionContacto: React.FC<InformacionContactoProps> = ({ setScreen }) => {
  const [activeTab, setActiveTab] = useState<"personal" | "operadores" | "parametros">("personal");
  const [selectedOperatorCategory, setSelectedOperatorCategory] = useState<OperatorCategory | "">("");

  return (
    <div className="min-h-screen bg-[#eef4fa] py-10 px-4 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Top Banner lines */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-sky-500 to-emerald-500 absolute top-0 left-0" />

      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen("home")}
              className="p-2.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-sky-700 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
              title="Volver al Inicio"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-sky-600 uppercase block">DIRECTORIO & REFERENCIAS</span>
              <h1 className="text-3xl font-black text-[#2d6639] tracking-tight uppercase">Información de contacto</h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-sky-100/80 p-1 rounded-xl border border-sky-200 shadow-sm self-start sm:self-center">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "personal" 
                  ? "bg-white text-sky-950 shadow-sm" 
                  : "text-sky-800 hover:text-sky-950 hover:bg-white/45"
              }`}
            >
              <Users className="w-4 h-4" />
              Personal interno
            </button>
            <button
              onClick={() => setActiveTab("operadores")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "operadores" 
                  ? "bg-white text-sky-950 shadow-sm" 
                  : "text-sky-800 hover:text-sky-950 hover:bg-white/45"
              }`}
            >
              <Truck className="w-4 h-4" />
              Operadores y guías
            </button>
            <button
              onClick={() => setActiveTab("parametros")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "parametros" 
                  ? "bg-white text-sky-950 shadow-sm" 
                  : "text-sky-800 hover:text-sky-950 hover:bg-white/45"
              }`}
            >
              <Sliders className="w-4 h-4" />
              Parámetros técnicos
            </button>
          </div>
        </div>

        {/* Dynamic Content Frame */}
        <div className="bg-sky-50 border border-sky-200 shadow-xl rounded-2xl overflow-hidden p-6 mb-8 flex-1">
          
          {/* TAB 1: PERSONAL INTERNO */}
          {activeTab === "personal" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-3 bg-white border border-sky-200 rounded-xl p-4 shadow-sm">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-600 mt-0.5">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-sky-950 uppercase tracking-wide">Áreas y personal que intervienen</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Personal de CLIBA SF involucrado de manera directa en el proceso administrativo, operativo, logístico y normativo de acopios y retiros de residuos.
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-sky-200/80 rounded-xl shadow-sm">
                <table className="w-full text-left border-collapse text-xs table-auto bg-white">
                  <thead>
                    <tr className="bg-sky-100 border-b border-sky-200 text-sky-950 select-none">
                      <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Puesto</th>
                      <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Nombre</th>
                      <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Mail de contacto</th>
                      <th className="p-3.5 font-bold tracking-wider text-center">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 text-center border-r border-sky-100">Jefe Mantenimiento</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">Gustavo Arrúa</td>
                      <td className="p-3 font-mono text-center border-r border-sky-100 text-slate-400 font-bold">-</td>
                      <td className="p-3 text-slate-600 text-center italic">-</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-800 text-center border-r border-sky-100">Supervisor Mantenimiento</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">Alejandro Musuaruana</td>
                      <td className="p-3 font-mono text-center border-r border-sky-100 text-sky-700 underline font-bold">
                        <a href="mailto:amusuruana@cliba.com.ar" className="flex items-center justify-center gap-1 hover:text-sky-900">
                          <Mail className="w-3.5 h-3.5" /> amusuruana@cliba.com.ar
                        </a>
                      </td>
                      <td className="p-3 text-slate-600 text-center font-semibold">Desde las 13 hs</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 text-center border-r border-sky-100">Logística flota / Compras</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">Matías Barroso</td>
                      <td className="p-3 font-mono text-center border-r border-sky-100 text-slate-400 font-bold">-</td>
                      <td className="p-3 text-slate-600 text-center font-semibold">De mañana</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-800 text-center border-r border-sky-100">Responsable Compras</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">Alejandro Frezza</td>
                      <td className="p-3 font-mono text-center border-r border-sky-100 text-slate-400 font-bold">-</td>
                      <td className="p-3 text-slate-600 text-center italic">-</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 text-center border-r border-sky-100">Ambiente CLIBA SF</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">Alejandra Prono y Silvana Santarelli (GEA)</td>
                      <td className="p-3 font-mono text-center border-r border-sky-100 text-slate-400 font-bold">-</td>
                      <td className="p-3 text-slate-600 text-center italic">-</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-800 text-center border-r border-sky-100">Responsable Administración</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">Gastón Grosso (Almacén, Compras)</td>
                      <td className="p-3 font-mono text-center border-r border-sky-100 text-slate-400 font-bold">-</td>
                      <td className="p-3 text-slate-600 text-center italic">-</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 text-center border-r border-sky-100">Operarios</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">Sectores Taller Mantenimiento y Almacén</td>
                      <td className="p-3 font-mono text-center border-r border-sky-100 text-slate-400 font-bold">-</td>
                      <td className="p-3 text-slate-600 text-center italic">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 2: OPERADORES Y GUÍAS (CON DESPLEGABLE) */}
          {activeTab === "operadores" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Desplegable Selector */}
              <div className="bg-white border border-sky-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-sky-600 tracking-wider uppercase">Seleccionar Categoría de Residuos</label>
                  <p className="text-xs text-slate-500 font-medium">Consulte el directorio clasificado para cada flujo específico.</p>
                </div>
                <div className="relative">
                  <select
                    value={selectedOperatorCategory}
                    onChange={(e) => setSelectedOperatorCategory(e.target.value as OperatorCategory | "")}
                    className="appearance-none bg-sky-50 border border-sky-300 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-sky-950 uppercase tracking-wider outline-none focus:ring-2 focus:ring-sky-500/30 transition-shadow min-w-[280px] cursor-pointer"
                  >
                    <option value="">Seleccione una categoría de residuos...</option>
                    <option value="NFU">NFU (Neumáticos Fuera de Uso)</option>
                    <option value="RINP">Residuos Industriales No Peligrosos (RINP)</option>
                    <option value="Peligrosos">Residuos Peligrosos (RP)</option>
                  </select>
                  <ChevronRight className="w-4 h-4 text-sky-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                </div>
              </div>

              {/* No selected category placeholder */}
              {selectedOperatorCategory === "" && (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-sky-300 rounded-xl shadow-sm">
                  <div className="p-3 bg-sky-100 rounded-full text-sky-600 mb-3">
                    <Truck className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-sky-950 uppercase tracking-wide">Seleccione una categoría de residuos</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                    Debe seleccionar una categoría en el selector de arriba para desplegar las tablas de contacto, operadores e instructivos autorizados.
                  </p>
                </div>
              )}

              {/* --------------------- CATEGORY: NFU --------------------- */}
              {selectedOperatorCategory === "NFU" && (
                <div className="space-y-6">
                  {/* NFU Operators Table */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-1">Directorio de Operadores Clínicos (NFU)</h3>
                    <div className="overflow-x-auto border border-sky-200/80 rounded-xl shadow-sm">
                      <table className="w-full text-left border-collapse text-xs table-auto bg-white">
                        <thead>
                          <tr className="bg-sky-100 border-b border-sky-200 text-sky-950 select-none">
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Empresa</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Función</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Nombre</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Teléfono de contacto</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Horario de atención</th>
                            <th className="p-3.5 font-bold tracking-wider text-center">Observaciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100">
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-3 font-black text-slate-900 text-center border-r border-sky-100" rowSpan={2}>WORMS</td>
                            <td className="p-3 font-medium text-slate-700 text-center border-r border-sky-100" rowSpan={2}>Operador Tratador de NFU</td>
                            <td className="p-3 font-bold text-slate-800 text-center border-r border-sky-100">Dani Bosicovich</td>
                            <td className="p-3 font-mono font-bold text-sky-850 text-center border-r border-sky-100">3462-309721</td>
                            <td className="p-3 text-slate-400 text-center italic" rowSpan={2}>-</td>
                            <td className="p-3 text-slate-400 text-center italic" rowSpan={2}>-</td>
                          </tr>
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-3 font-bold text-slate-800 text-center border-r border-sky-100">Alejandro Brugnara</td>
                            <td className="p-3 font-mono font-bold text-sky-850 text-center border-r border-sky-100">3464-639469</td>
                          </tr>
                          <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/10">
                            <td className="p-3 font-black text-slate-900 text-center border-r border-sky-100">CAT Municipalidad Coronda</td>
                            <td className="p-3 font-medium text-slate-700 text-center border-r border-sky-100">Operador habilitado para el Almacenamiento Transitorio de los Residuos</td>
                            <td className="p-3 font-bold text-slate-800 text-center border-r border-sky-100">Juan (Encargado CAT)</td>
                            <td className="p-3 font-mono font-bold text-sky-850 text-center border-r border-sky-100">03404-535904</td>
                            <td className="p-3 text-slate-700 text-center font-medium border-r border-sky-100">Lunes a Viernes de 6:30 a 17:00 hs. Coordinar envío con Juan Encargado CAT (contacto: 03404-535904)</td>
                            <td className="p-3 text-slate-600 text-center font-semibold">Evitar llevar NFU en días de lluvia o posterior a grandes precipitaciones. Posible empantanamiento.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* NFU Management Guideline / Timeline */}
                  <div className="bg-white border border-sky-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
                      <FileText className="w-5 h-5 text-sky-600" />
                      <h4 className="text-sm font-black text-sky-950 uppercase tracking-wide">Instructivo de Gestión (Procedimiento en Elaboración)</h4>
                    </div>

                    <div className="space-y-4">
                      {[
                        { step: "1", text: "Cuando se encuentre al 90% de la capacidad de almacenamiento de NFU en la base CLIBA SF, desde las áreas de Mantenimiento y Ambiente iniciar averiguaciones por disponibilidad de transporte propio, para transportar los NFU al CAT Coronda." },
                        { step: "2", text: "Cuando se llega a la capacidad total, Mantenimiento/Logística coordinan la disponibilidad de una unidad de transporte propio." },
                        { step: "3", text: "Contando con la unidad de transporte propia o, en caso contrario, de no encontrarse ninguna disponible, Mantenimiento SOLICITA a Compras un pedido de unidad externa para transportar los NFU." },
                        { step: "4", text: "Una vez confirmado el transporte, Ambiente y Mantenimiento chequean las condiciones ambientales y de acceso al predio del CAT y se define un día para el viaje." },
                        { step: "5", text: "Confirmado buen pronóstico de tiempo y las posibilidades de acceso al CAT, Ambiente avisa y coordina con el CAT para proceder con el envío." },
                        { step: "6", text: "Ejecución del transporte y traslado de los NFU al CAT. El mismo día el CAT emite un Manifiesto de Recepción de los NFU y lo envía digitalmente al área Ambiente Cliba." },
                        { step: "7", text: "Ambiente CLIBA registra el Manifiesto de Recepción en la planilla correspondiente y realiza seguimiento con el proveedor hasta obtener el Certificado de Tratamiento Final (los NFU se valorizan), el cual se registra en la planilla y se documenta en carpeta Ambiente." }
                      ].map((s) => (
                        <div key={s.step} className="flex gap-3 items-start text-xs text-slate-700">
                          <span className="w-5 h-5 bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">{s.step}</span>
                          <span className="leading-relaxed">{s.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Aclaraciones */}
                    <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100 text-[11px] text-slate-600 leading-relaxed font-semibold">
                      <p className="mb-1.5 text-sky-950 font-bold uppercase tracking-wider block">Aclaraciones Importantes:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Antes de iniciar la gestión con cualquier Operador de residuos, Ambiente chequea el estado de habilitación del mismo. Solo deben utilizarse Operadores debidamente habilitados al momento de prestar el servicio.</li>
                        <li>Internamente el CAT cuando completa su capacidad de acopio, coordina con un Operador Tratador (WORMS). Se trasladan los NFU a la Planta de Tratamiento de WORMS y ésta emite finalmente el Certificado de Tratamiento Final. Transcurren entre 3-4 meses hasta obtener el Certificado. Tratamiento de WORMS.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------- CATEGORY: RINP --------------------- */}
              {selectedOperatorCategory === "RINP" && (
                <div className="space-y-6">
                  {/* Credentials / Portal Box */}
                  <div className="bg-white border border-sky-200 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 border-b border-sky-100 pb-2">
                      <Lock className="w-5 h-5 text-sky-600" />
                      <h4 className="text-sm font-black text-sky-950 uppercase tracking-wide">Datos de Acceso para Generar Manifiesto de RINP</h4>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <a 
                        href="https://www.santafe.gov.ar/tramites/gestionresiduos/login" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs text-sky-700 font-bold underline hover:text-sky-900 flex items-center gap-1.5 bg-sky-50 px-3 py-2 rounded-lg border border-sky-100"
                      >
                        Portal Oficial de Trámites Santa Fe <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 bg-slate-50 border border-slate-100 p-3 rounded-lg w-full sm:w-auto text-[11px] font-mono">
                        <div>
                          <span className="text-slate-500 block uppercase text-[9px] font-bold">Nro. Generador</span>
                          <strong className="text-slate-800 block text-xs">G-5659</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase text-[9px] font-bold">Usuario</span>
                          <strong className="text-slate-800 block text-xs">307089377420001</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase text-[9px] font-bold">Contraseña</span>
                          <strong className="text-slate-800 block text-xs">307089377420001</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RINP Operators Table */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-1">Directorio de Operadores Clínicos (RINP)</h3>
                    <div className="overflow-x-auto border border-sky-200/80 rounded-xl shadow-sm">
                      <table className="w-full text-left border-collapse text-xs table-auto bg-white">
                        <thead>
                          <tr className="bg-sky-100 border-b border-sky-200 text-sky-950 select-none">
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Empresa</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Corrientes habilitadas</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Persona contacto técnico</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Datos de contacto</th>
                            <th className="p-3.5 font-bold tracking-wider text-center">Información complementaria para manifiesto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100">
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-3.5 font-black text-slate-900 text-center border-r border-sky-100">Coop. de Trabajo Mundo Reciclado Limitada</td>
                            <td className="p-3.5 font-semibold text-slate-850 text-center border-r border-sky-100 space-y-1">
                              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[9px] block">NP 31: Cartón</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[9px] block">NP 9: Chatarra</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[9px] block">NP 28: Madera</span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-800 text-center border-r border-sky-100">Ing. Agustín Dubois</td>
                            <td className="p-3.5 font-mono text-center border-r border-sky-100">
                              <span className="block text-sky-850 font-bold">342-5168151</span>
                            </td>
                            <td className="p-3.5 text-slate-600 text-center space-y-1">
                              <p><strong className="font-bold text-slate-800">CUIT:</strong> 30716177706</p>
                              <p><strong className="font-bold text-slate-800">Presidenta:</strong> Verónica (Tel: 342-5914136)</p>
                              <p><strong className="font-bold text-slate-800">Dir:</strong> San Juan 1250</p>
                              <p className="text-[10px] italic pt-1 border-t border-sky-100">Instrucciones: Utilización de EPP y medidas de seguridad vial. (Peso 1 pallet: 21,5 kg)</p>
                            </td>
                          </tr>
                          <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/10">
                            <td className="p-3.5 font-black text-slate-900 text-center border-r border-sky-100">JITSA</td>
                            <td className="p-3.5 font-semibold text-slate-850 text-center border-r border-sky-100 space-y-1">
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] block">NP 09: Chatarra limpia</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] block">NP 27: Plásticos</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] block">NP 31: Cartones</span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-800 text-center border-r border-sky-100">Martín Molina (Jefe de Planta)</td>
                            <td className="p-3.5 text-left border-r border-sky-100 text-[10px] space-y-1 font-semibold text-slate-700">
                              <p><strong className="text-slate-900 block font-bold">Martín Molina:</strong> admin / mlatino@jit-sa.com <span className="font-mono block text-sky-850 font-bold">Cel: 342-525-9072</span></p>
                              <p><strong className="text-slate-900 block font-bold">Administración:</strong> ivirgilio@jit-sa.com</p>
                              <p><strong className="text-slate-900 block font-bold">César Zurschmitten:</strong> Logística <span className="font-mono block text-sky-850 font-bold">342-648-5680</span></p>
                              <p><strong className="text-slate-900 block font-bold">Romina García:</strong> Ingeniun SA <span className="font-mono block text-sky-850 font-bold">342-6135625</span></p>
                            </td>
                            <td className="p-3.5 text-slate-600 text-center space-y-1">
                              <p><strong className="font-bold text-slate-800">CUIT:</strong> 30621881422 &middot; <strong className="font-bold text-slate-800">TEL:</strong> +54 9 342 525-9072</p>
                              <p><strong className="font-bold text-slate-800">Planta:</strong> Fdo. Quiroga y Av. Angel Peñaloza (Coord. 31°33,51' S; 60°42,26' O)</p>
                              <p><strong className="font-bold text-slate-800">Operador N°:</strong> O 8037</p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-750 bg-sky-200/50 inline-block px-1.5 py-0.5 rounded border border-sky-200 mt-1">Dom: AF686UW (RTV Vence: 30/10/2026)</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Drivers and vehicles layout with the requested columns! */}
                  <div className="bg-white border border-sky-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-sky-100 pb-2">
                      <ShieldCheck className="w-5 h-5 text-[#2d6639]" />
                      <h4 className="text-sm font-bold text-sky-950">Personal y vehículos habilitados para ingreso a la base</h4>
                    </div>
                    
                    <div className="overflow-hidden border border-sky-200/50 rounded-lg shadow-xs">
                      <table className="w-full text-xs text-center bg-white border-collapse">
                        <thead>
                          <tr className="bg-sky-100 text-sky-950 border-b border-sky-200 font-bold text-[11px] select-none">
                            <th className="p-3 border-r border-sky-200/40 text-left">Empresa</th>
                            <th className="p-3 border-r border-sky-200/40">Nombre</th>
                            <th className="p-3 border-r border-sky-200/40">Dni</th>
                            <th className="p-3 border-r border-sky-200/40">Cel</th>
                            <th className="p-3">Puesto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100">
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-2.5 border-r border-sky-100 text-slate-900 font-bold text-left">Mundo Reciclado</td>
                            <td className="p-2.5 border-r border-sky-100 font-semibold text-slate-850">INSAURRALDE, MIGUEL G.</td>
                            <td className="p-2.5 border-r border-sky-100 font-mono text-slate-705">26695007</td>
                            <td className="p-2.5 border-r border-sky-100 font-mono text-sky-800 font-bold">342 5924254</td>
                            <td className="p-2.5 font-semibold text-emerald-800">Chofer</td>
                          </tr>
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-2.5 border-r border-sky-100 text-slate-900 font-bold text-left">Mundo Reciclado</td>
                            <td className="p-2.5 border-r border-sky-100 font-semibold text-slate-850">MOREIRA, FABIO</td>
                            <td className="p-2.5 border-r border-sky-100 text-amber-700 font-bold italic">Pedir</td>
                            <td className="p-2.5 border-r border-sky-100 text-slate-400 font-bold">-</td>
                            <td className="p-2.5 font-semibold text-slate-600">Asistente</td>
                          </tr>
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-2.5 border-r border-sky-100 text-slate-900 font-bold text-left">Jitsa</td>
                            <td className="p-2.5 border-r border-sky-100 font-semibold text-slate-850">Gavazzi Mariano Daniel</td>
                            <td className="p-2.5 border-r border-sky-100 font-mono text-slate-705">20-33949452-6</td>
                            <td className="p-2.5 border-r border-sky-100 text-slate-400 font-bold">-</td>
                            <td className="p-2.5 font-semibold text-emerald-800">Chofer</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-xs space-y-1">
                        <p className="text-[10px] font-bold text-[#2d6639] uppercase tracking-widest">Vehículo homologado (Mundo Reciclado):</p>
                        <p className="font-semibold text-slate-800">Pick Up Zanella Z-Truck &middot; Patente: <span className="font-mono bg-white px-1 py-0.5 rounded text-slate-900 font-bold border border-sky-100/80">AG332JD</span></p>
                        <p className="text-[10px] text-slate-500 font-medium">Vencimiento RTO: DIC 23 &middot; Patentamiento RTO: DIC 26 <span className="text-sky-700 italic">(ver drive)</span></p>
                      </div>
                      <div className="bg-sky-50 border border-sky-200 p-3 rounded-lg text-xs space-y-1">
                        <p className="text-[10px] font-bold text-[#2d6639] uppercase tracking-widest">Vehículo homologado (Jitsa):</p>
                        <p className="font-semibold text-slate-800">Chasis Con Cabina IVECO &middot; Patente: <span className="font-mono bg-white px-1 py-0.5 rounded text-slate-900 font-bold border border-sky-100/80">AF686UW</span></p>
                        <p className="text-[10px] text-slate-500 font-medium">Poliza: NRN 192 (vence: 30/10/2026) &middot; Tarjeta verde: Sin Vto <span className="text-sky-700 italic">(ver drive)</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Instructivo de Gestión Protocol */}
                  <div className="bg-white border border-sky-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
                      <FileText className="w-5 h-5 text-sky-600" />
                      <h4 className="text-sm font-black text-sky-950 uppercase tracking-wide">Protocolo de Gestión en el Marco del Contrato con Milicic Vigente</h4>
                    </div>

                    <div className="space-y-4">
                      {[
                        { step: "1", text: "Responsable de turno o supervisor de Mantenimiento detecta que el estado de llenado del contenedor se encuentra a un 80-90 % de su capacidad." },
                        { step: "2", text: "El Supervisor de Mantenimiento da aviso a Ambiente y solicita a Operaciones su retiro y disposición en relleno sanitario." },
                        { step: "3", text: "Supervisor de Operaciones asigna unidad exclusiva para servirlo, y le especifica al chofer que se trata de Residuos No Peligrosos de CLIBA-TECSAN, para informar en el relleno." },
                        { step: "4", text: "El chofer informa a la Guardia de la Base que la ruta es “Residuos de Base” (nueva categoría incorporada a la Planilla PARTE RADIO-OPERADOR CONTROL DE CAMIONES (F/N0709-007/01)), para que registre la unidad." },
                        { step: "5", text: "En el relleno, el chofer informa a la guardia que dispone la corriente “Residuos No Peligrosos de CLIBA-TECSAN”, para su registro en el ticket de pesaje, y al regresar a Base lo entrega a Supervisor de Operaciones." },
                        { step: "6", text: "El Supervisor de Operaciones envía foto de ticket de pesaje a Ambiente para su registro." },
                        { step: "7", text: "Mensualmente, a mes vencido, Ambiente gestiona ante Municipalidad y Milicic el certificado de Disposición final por la totalidad de los residuos dispuestos en el mes." }
                      ].map((s) => (
                        <div key={s.step} className="flex gap-3 items-start text-xs text-slate-700">
                          <span className="w-5 h-5 bg-sky-100 text-sky-800 font-extrabold flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">{s.step}</span>
                          <span className="leading-relaxed">{s.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 p-2 bg-sky-50 rounded-lg border border-sky-100 text-[10px] text-slate-600 font-semibold">
                      * Antes de iniciar la gestión con cualquier Operador de Residuos, Ambiente chequea el estado de habilitación del mismo. Solo deben utilizarse Operadores debidamente habilitados al momento de prestar el servicio.
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------- CATEGORY: PELIGROSOS --------------------- */}
              {selectedOperatorCategory === "Peligrosos" && (
                <div className="space-y-6">
                  {/* Hazardous Operator List Table */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-1">Directorio de Operadores Clínicos (Residuos Peligrosos)</h3>
                    <div className="overflow-x-auto border border-sky-200/80 rounded-xl shadow-sm">
                      <table className="w-full text-left border-collapse text-xs table-auto bg-white">
                        <thead>
                          <tr className="bg-sky-100 border-b border-sky-200 text-sky-950 select-none">
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Empresa</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Corrientes habilitadas</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Persona de contacto</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Teléfono de contacto</th>
                            <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Mail de contacto</th>
                            <th className="p-3.5 font-bold tracking-wider text-center">Dominio del vehículo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100">
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-3 font-black text-slate-900 text-center border-r border-sky-100">Bravo Energy S.C.A</td>
                            <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100 font-mono">
                              <span className="font-sans px-1.5 py-0.5 rounded bg-sky-100/45 text-sky-950">Y8, Y9, Y48</span>
                            </td>
                            <td className="p-3 font-bold text-slate-800 text-center border-r border-sky-100">Gustavo Pieroni</td>
                            <td className="p-3 font-mono font-bold text-sky-850 text-center border-r border-sky-100">3492-526647</td>
                            <td className="p-3 font-mono text-center border-r border-sky-100 font-semibold">
                              <a href="mailto:ventas@idmsa.com.ar" className="text-sky-700 underline hover:text-sky-900 block">ventas@idmsa.com.ar</a>
                            </td>
                            <td className="p-3 text-slate-400 text-center italic">-</td>
                          </tr>
                          <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                            <td className="p-3 font-black text-slate-900 text-center border-r border-sky-100">IDM</td>
                            <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">
                              <p className="text-[10px] uppercase font-bold text-teal-800">Habilitado para todas las corrientes (S/MAyCC)</p>
                            </td>
                            <td className="p-3 font-bold text-slate-800 text-center border-r border-sky-100">Baldón Nicolás</td>
                            <td className="p-3 font-mono text-center border-r border-sky-100 font-bold text-sky-850">
                              <p>0341 640-7714. Interno 202/203</p>
                              <p className="text-[10px] text-slate-500">Cel: +54 341 6 407714</p>
                            </td>
                            <td className="p-3 text-slate-400 text-center italic border-r border-sky-100">-</td>
                            <td className="p-3 text-slate-400 text-center italic">-</td>
                          </tr>
                          <tr className="hover:bg-sky-50/50 transition-colors">
                            <td className="p-3 font-black text-slate-900 text-center border-r border-sky-100">PELCO</td>
                            <td className="p-3 text-slate-400 text-center italic border-r border-sky-100">-</td>
                            <td className="p-3 font-bold text-slate-800 text-center border-r border-sky-100">Sergio Florio</td>
                            <td className="p-3 font-mono font-bold text-sky-850 text-center border-r border-sky-100">341 - 341 8402</td>
                            <td className="p-3 text-slate-400 text-center italic border-r border-sky-100">-</td>
                            <td className="p-3 text-slate-400 text-center italic">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Operational Note */}
                  <div className="p-3 bg-sky-100/40 text-sky-950 font-bold border border-sky-200 rounded-lg text-xs leading-relaxed space-y-1">
                    <p className="uppercase tracking-wide text-xs">Aviso importante para cargas de Residuos Peligrosos:</p>
                    <p className="font-medium text-slate-700 text-[11px] leading-relaxed">
                      De acuerdo con la reglamentación nacional, todos los retiros de corrientes de la serie Y (Y8, Y9, Y48) exigen la carga obligatoria del manifiesto digitalizado correspondiente en formato <strong className="font-bold text-sky-900">PDF</strong>. Deje constancia del número de manifiesto correspondiente al despachante externo al momento del retiro.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: PARÁMETROS TÉCNICOS */}
          {activeTab === "parametros" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-3 bg-white border border-sky-200 rounded-xl p-4 shadow-sm">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-600 mt-0.5">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-sky-950 uppercase tracking-wide">Datos de registro interno & manifiestos electrónicos</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Guía homologada de capacidades de recipientes, equivalencias de pesajes estimados, taras y coeficientes necesarios para completar planillas y declaraciones.
                  </p>
                </div>
              </div>

              {/* Table with high contrast and sky-blue format */}
              <div className="overflow-x-auto border border-sky-200/80 rounded-xl shadow-sm">
                <table className="w-full text-left border-collapse text-xs table-auto bg-white">
                  <thead>
                    <tr className="bg-sky-100 border-b border-sky-200 text-sky-950 select-none">
                      <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Parámetro</th>
                      <th className="p-3.5 font-bold tracking-wider text-center border-r border-sky-200/60">Cantidad estimada</th>
                      <th className="p-3.5 font-bold tracking-wider text-center">Unidad de medida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Capacidad total de tambores en Boxes Y8</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">8</td>
                      <td className="p-3 text-slate-600 text-center font-bold">tambores</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Capacidad total de tambores en Boxes Y9</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">4</td>
                      <td className="p-3 text-slate-600 text-center font-bold">tambores</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Tara tambor de chapa 200 L (vacío)</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">16 - 18</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">kg</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Peso por unidad tambor lleno de Y48/Y8/Y9 (solo mat. absorbente usado)</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">100</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">kg</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Peso por unidad tambor lleno de Y9</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">213</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">kg</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Peso por unidad tambor lleno de Y48/Y8/Y9 (sólidos contaminados)</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">108</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">kg</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Peso bolsa de mat. absorbente</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">20</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">kg</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Cantidad de bolsas mat. absorbentes usadas por tambor</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">5</td>
                      <td className="p-3 text-slate-600 text-center font-bold">Unidades</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Peso batería Y34-Y35</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">33.8</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">kg</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Capacidad contenedor Almacenamiento Y48/Y12 (tóners usados)</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">240</td>
                      <td className="p-3 text-slate-600 text-center font-bold">Litros</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Peso estimado por tóner usado</td>
                      <td className="p-3 font-bold text-slate-900 text-center border-r border-sky-100">0.5</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">kg</td>
                    </tr>
                    <tr className="hover:bg-sky-50/50 transition-colors bg-sky-100/20">
                      <td className="p-3 font-semibold text-slate-850 text-center border-r border-sky-100">Dimensiones 1 tóner aprox.</td>
                      <td className="p-3 font-mono font-bold text-slate-900 text-center border-r border-sky-100">0.00535</td>
                      <td className="p-3 text-slate-600 text-center font-mono font-bold">m3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>

        {/* Action button back to Home */}
        <div className="flex justify-center">
          <button
            onClick={() => setScreen("home")}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
          >
            &larr; Volver a pantalla principal
          </button>
        </div>
      </div>
    </div>
  );
};
