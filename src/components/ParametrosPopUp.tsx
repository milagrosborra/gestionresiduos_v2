import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, X, Table } from "lucide-react";

export const ParametrosPopUp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const parameterRows = [
    { parametro: "Capacidad total de tambores en Boxes Y8", cantidad: "8", unidad: "tambores" },
    { parametro: "Capacidad total de tambores en Boxes Y9", cantidad: "4", unidad: "tambores" },
    { parametro: "Tara tambor de chapa 200 L (vacío)", cantidad: "16 - 18", unidad: "kg" },
    { parametro: "Peso por unidad tambor lleno de Y48/Y8/Y9 (solo mat. absorbente usado)", cantidad: "100", unidad: "kg" },
    { parametro: "Peso por unidad tambor lleno de Y9", cantidad: "213", unidad: "kg" },
    { parametro: "Peso por unidad tambor lleno de Y48/Y8/Y9 (sólidos contaminados)", cantidad: "108", unidad: "kg" },
    { parametro: "Peso bolsa de mat. absorbente", cantidad: "20", unidad: "kg" },
    { parametro: "Cantidad de bolsas mat. absorbentes usadas por tambor", cantidad: "5", unidad: "Unidades" },
    { parametro: "Peso batería Y34-Y35", cantidad: "33.8", unidad: "kg" },
    { parametro: "Capacidad contenedor Almacenamiento Y48/Y12 (tóners usados)", cantidad: "240", unidad: "Litros" },
    { parametro: "Peso estimado por tóner usado", cantidad: "0.5", unidad: "kg" },
    { parametro: "Dimensiones 1 tóner aprox.", cantidad: "0.00535", unidad: "m3" },
  ];

  return (
    <div id="parametros-popup-container" className="my-2">
      {/* Trigger Button */}
      <button
        id="btn-open-parametros"
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-850 font-bold text-xs tracking-wider uppercase transition-all duration-150 cursor-pointer shadow-sm"
      >
        <Table className="w-4 h-4 text-sky-700" />
        Ver Datos de Registro Interno & Manifiestos
      </button>

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <div id="parametros-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              id="parametros-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-sky-200/80 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center select-none">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-sky-400" />
                  <span className="font-extrabold tracking-wide uppercase text-sm">Parámetros Técnicos Homologados</span>
                </div>
                <button
                  id="btn-close-parametros"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div className="text-xs text-slate-600 bg-sky-50 border border-sky-100 rounded-xl p-3 leading-relaxed">
                  <h4 className="font-bold text-sky-950 uppercase tracking-wider mb-1 text-[11px]">Datos de registro interno & manifiestos electrónicos</h4>
                  Guía de capacidades, equivalencias de pesajes estimados, taras y coeficientes necesarios para planillas y declaraciones.
                </div>

                {/* Table */}
                <div className="border border-sky-150 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs table-auto bg-white">
                    <thead>
                      <tr className="bg-sky-100 border-b border-sky-200 text-sky-950 font-bold uppercase tracking-wider text-[10px] select-none">
                        <th className="p-3 border-r border-sky-200/60">Parámetro</th>
                        <th className="p-3 border-r border-sky-200/60 text-center">Cant. Est.</th>
                        <th className="p-3 text-center">Unidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {parameterRows.map((row, index) => (
                        <tr key={index} className={`hover:bg-sky-50/50 transition-colors ${index % 2 === 1 ? "bg-sky-100/10" : ""}`}>
                          <td className="p-2.5 font-medium text-slate-700 border-r border-sky-100">{row.parametro}</td>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-sky-100 text-center">{row.cantidad}</td>
                          <td className="p-2.5 text-slate-600 text-center font-semibold">{row.unidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-100 flex justify-end">
                <button
                  id="btn-close-parametros-footer"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow"
                >
                  Cerrar Tabla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
