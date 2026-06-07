/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoriaResiduo =
  | "Residuos Industriales No Peligrosos"
  | "Residuos Peligrosos"
  | "RSU"
  | "Compostables";

export interface RegistroInterno {
  id: number;
  tipo: "interno";
  categoria: CategoriaResiduo;
  corriente: string;
  fecha: string; // Formatted as dd/mm/yyyy
  cantidad: number;
  unidad: string;
}

export interface RetiroExterno {
  id: number;
  tipo: "externo";
  categoria: CategoriaResiduo;
  corriente: string;
  fecha: string; // Formatted as dd/mm/yyyy

  // GESTIÓN INTERNA
  manifesto: string; // N° de Manifiesto electrónico
  fechaManifiesto: string; // Fecha Manifiesto
  cantEst: string; // Cantidad (campo libre)
  unidad: string; // Unidad
  fechaRetiro: string; // Fecha de retiro
  embalaje: string; // Embalaje (e.g., "1A1", "granel", "Otros" / custom text)
  observaciones: string; // Observaciones
  pdfCargado: boolean; // True if Manifiesto PDF uploaded

  // GESTIÓN EXTERNA
  transportista: string; // Operador Transportista (dropdown or Otros)
  patente: string; // Patente vehículo
  fechaTratamiento: string; // Fecha de tratamiento
  pdfCertificadoCargado: boolean; // True if Certificado Tratamiento PDF uploaded
}

export interface AlertaAlmacenamiento {
  id: number;
  tipo: "interno";
  categoria: CategoriaResiduo;
  corriente: string;
  fecha: string;
  cantidad: number;
  unidad: string;
  months: number;
  level: "preventiva" | "critica";
}

export interface TasaGeneracion {
  corriente: string;
  tasaDia: number;
  tasaMes: number;
  dias: number;
  cantTotal: number;
  unidad: string;
}
