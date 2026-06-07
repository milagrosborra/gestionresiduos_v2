/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";

interface DateInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const DPOS = [0, 1, 3, 4, 6, 7, 8, 9];

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, className }) => {
  const ref = useRef<HTMLInputElement>(null);

  function toDisplay(v: string) {
    const raw = (v || "").replace(/[^0-9_]/g, "").padEnd(8, "_");
    return `${raw[0]}${raw[1]}/${raw[2]}${raw[3]}/${raw[4]}${raw[5]}${raw[6]}${raw[7]}`;
  }

  function fromDigits(d8: string) {
    const d = d8.padEnd(8, "_");
    return `${d[0]}${d[1]}/${d[2]}${d[3]}/${d[4]}${d[5]}${d[6]}${d[7]}`;
  }

  function getDigits(v: string) {
    return (v || "").replace(/[^0-9]/g, "");
  }

  function getCursorDig() {
    const el = ref.current;
    if (!el) return 0;
    const pos = el.selectionStart || 0;
    for (let i = 0; i < DPOS.length; i++) {
      if (pos <= DPOS[i]) return i;
    }
    return DPOS.length - 1;
  }

  function setCursorAt(idx: number) {
    const el = ref.current;
    if (!el) return;
    const pos = DPOS[Math.min(idx, DPOS.length - 1)];
    requestAnimationFrame(() => el.setSelectionRange(pos, pos));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // We handle custom mechanics for navigation and replacement editing
    if (
      e.key === "Tab" ||
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Meta" ||
      e.key === "Enter"
    ) {
      return; // Permitted keys to not intercept
    }
    
    e.preventDefault();
    const digits = getDigits(value).padEnd(8, "_").split("");
    const cur = getCursorDig();

    if (e.key === "ArrowRight") {
      setCursorAt(Math.min(cur + 1, DPOS.length - 1));
      return;
    }
    if (e.key === "ArrowLeft") {
      setCursorAt(Math.max(cur - 1, 0));
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      const t = e.key === "Backspace" ? Math.max(cur - 1, 0) : cur;
      digits[t] = "_";
      onChange(fromDigits(digits.join("")));
      setCursorAt(t);
      return;
    }
    
    if (/^\d$/.test(e.key)) {
      digits[cur] = e.key;
      onChange(fromDigits(digits.join("")));
      setCursorAt(Math.min(cur + 1, DPOS.length - 1));
      return;
    }
  }

  function handleClick() {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart || 0;
    let best = 0;
    let bestD = 99;
    DPOS.forEach((dp, i) => {
      const d = Math.abs(dp - pos);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setCursorAt(best);
  }

  return (
    <input
      ref={ref}
      type="text"
      value={toDisplay(value)}
      onChange={() => {}}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onFocus={handleClick}
      className={`font-mono text-center tracking-widest text-gray-800 ${className || ""}`}
      tabIndex={0}
      placeholder="00/00/0000"
    />
  );
};
