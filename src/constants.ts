/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegistroInterno, RetiroExterno } from "./types";

export const CORRIENTES = {
  "Residuos Industriales No Peligrosos": [
    "NP9 (Chatarra)",
    "NP28 (Pallets de madera)",
    "NP31 (Cartones)",
    "NP31 (Taller)"
  ],
  "Residuos Peligrosos": [
    "Y8",
    "Y9",
    "Y48/Y12",
    "Y48-Y12",
    "Y48-Y8/Y9"
  ],
  "RSU": ["RSU"],
  "Compostables": ["Compostables"],
  "NFU": ["NFU"]
} as const;

export const UNIDAD_HABITUAL: Record<string, string> = {
  "NP31 (Cartones)": "Kilogramos",
  "NP31 (Taller)": "Kilogramos",
  "NP9 (Chatarra)": "Kilogramos",
  "NP28 (Pallets de madera)": "Kilogramos",
  "NFU": "Unidades"
};

export const UNIDADES = ["Kilogramos", "Litros", "Unidades"] as const;

export const COLORS = {
  blue: "#2e86c1",
  blueDark: "#1a5276",
  blueLight: "#d6eaf8",
  blueMid: "#aed6f1",
  bluePale: "#ebf5fb",
  green: "#1e8449",
  greenLight: "#d5f5e3",
  grayBg: "#f0f4f8",
  grayMid: "#c8d6e0",
  grayText: "#5d6d7e",
  dark: "#1b2631",
  white: "#ffffff",
  danger: "#c2392b",
  dangerBg: "#fdf2f0",
  warning: "#b7770d",
  warningBg: "#fef9ec",
  compost: "#7d6608",
  compostBg: "#fef9e7"
};

export const CAT_COLOR: Record<string, string> = {
  "Residuos Peligrosos": COLORS.danger,
  "Residuos Industriales No Peligrosos": COLORS.blue,
  "RSU": COLORS.green,
  "Compostables": COLORS.compost,
  "NFU": "#0f766e"
};

export const HOME_COLORS = {
  bg: "#0d2233",
  bgCard: "#1a3a52",
  bgCardHov: "#204d6b",
  border: "#2a5a7a",
  accent: "#4a9fd4",
  textSub: "rgba(255, 255, 255, 0.65)"
};

// Initial realistic seed datasets for testability and visualization
export const INITIAL_REGISTROS: RegistroInterno[] = [];

export const INITIAL_RETIROS: RetiroExterno[] = [];

// Brand Color Schemes or visual elements
export const BRAND = {
  accent: "#2e86c1",
  secondary: "#1a5276",
  logoText: "Sistema de Residuos",
  subText: "Grupo Ambiental"
};
