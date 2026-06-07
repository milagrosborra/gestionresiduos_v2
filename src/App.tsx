/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RegistroInterno, RetiroExterno, AlertaAlmacenamiento } from "./types";
import { INITIAL_REGISTROS, INITIAL_RETIROS } from "./constants";
import { monthsAgo } from "./utils";

// Firebase imports
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";

// Component imports
import { HomeScreen } from "./components/HomeScreen";
import { RegistroInternoForm } from "./components/RegistroInternoForm";
import { RetiroExternoForm } from "./components/RetiroExternoForm";
import { PanelControl } from "./components/PanelControl";
import { InformacionContacto } from "./components/InformacionContacto";

export default function App() {
  const [screen, setScreen] = useState<"home" | "interno" | "externo" | "panel" | "contacto">("home");

  // 1. Initial State Syncing (reads from localStorage instantly for fast load, then synced with Firestore)
  const [registros, setRegistros] = useState<RegistroInterno[]>(() => {
    try {
      const persisted = localStorage.getItem("sistema_registros_v4");
      return persisted ? JSON.parse(persisted) : INITIAL_REGISTROS;
    } catch {
      return INITIAL_REGISTROS;
    }
  });

  const [retiros, setRetiros] = useState<RetiroExterno[]>(() => {
    try {
      const persisted = localStorage.getItem("sistema_retiros_v4");
      return persisted ? JSON.parse(persisted) : INITIAL_RETIROS;
    } catch {
      return INITIAL_RETIROS;
    }
  });

  // Sync to localstorage upon any modifications as a backup
  useEffect(() => {
    localStorage.setItem("sistema_registros_v4", JSON.stringify(registros));
  }, [registros]);

  useEffect(() => {
    localStorage.setItem("sistema_retiros_v4", JSON.stringify(retiros));
  }, [retiros]);

  // Real-time Cloud Synchronization (Firestore -> React State)
  useEffect(() => {
    // A. Listen for internal registries (registros)
    const unsubRegistros = onSnapshot(collection(db, "registros"), (snapshot) => {
      const remoteItems: RegistroInterno[] = [];
      snapshot.forEach((doc) => {
        remoteItems.push(doc.data() as RegistroInterno);
      });

      if (snapshot.empty) {
        const alreadySeeded = localStorage.getItem("sistema_db_seeded_registros_v2");
        if (!alreadySeeded) {
          // Cloud database is empty and first-time use, seed default values in cloud
          INITIAL_REGISTROS.forEach((item) => {
            setDoc(doc(db, "registros", String(item.id)), item).catch((err) => {
              handleFirestoreError(err, OperationType.CREATE, `registros/${item.id}`);
            });
          });
          localStorage.setItem("sistema_db_seeded_registros_v2", "true");
        } else {
          setRegistros([]);
        }
      } else {
        setRegistros(remoteItems.sort((a, b) => a.id - b.id));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "registros");
    });

    // B. Listen for external dispatches (retiros)
    const unsubRetiros = onSnapshot(collection(db, "retiros"), (snapshot) => {
      const remoteItems: RetiroExterno[] = [];
      snapshot.forEach((doc) => {
        remoteItems.push(doc.data() as RetiroExterno);
      });

      if (snapshot.empty) {
        const alreadySeeded = localStorage.getItem("sistema_db_seeded_retiros_v2");
        if (!alreadySeeded) {
          // Cloud database is empty and first-time use, seed default values in cloud
          INITIAL_RETIROS.forEach((item) => {
            setDoc(doc(db, "retiros", String(item.id)), item).catch((err) => {
              handleFirestoreError(err, OperationType.CREATE, `retiros/${item.id}`);
            });
          });
          localStorage.setItem("sistema_db_seeded_retiros_v2", "true");
        } else {
          setRetiros([]);
        }
      } else {
        setRetiros(remoteItems.sort((a, b) => a.id - b.id));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "retiros");
    });

    return () => {
      unsubRegistros();
      unsubRetiros();
    };
  }, []);

  // Sync mutations back to cloud (React state-setting triggers matching updates to Firestore)
  const handleSetRegistros = (val: React.SetStateAction<RegistroInterno[]>) => {
    const next = typeof val === "function" ? val(registros) : val;
    const currentIds = new Set(registros.map((r) => r.id));
    const nextIds = new Set(next.map((r) => r.id));

    // Handle deletes
    registros.forEach((item) => {
      if (!nextIds.has(item.id)) {
        deleteDoc(doc(db, "registros", String(item.id))).catch((err) => {
          handleFirestoreError(err, OperationType.DELETE, `registros/${item.id}`);
        });
      }
    });

    // Handle additions / updates
    next.forEach((item) => {
      const currentItem = registros.find((r) => r.id === item.id);
      if (!currentItem || JSON.stringify(currentItem) !== JSON.stringify(item)) {
        setDoc(doc(db, "registros", String(item.id)), item).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `registros/${item.id}`);
        });
      }
    });
  };

  const handleSetRetiros = (val: React.SetStateAction<RetiroExterno[]>) => {
    const next = typeof val === "function" ? val(retiros) : val;
    const currentIds = new Set(retiros.map((r) => r.id));
    const nextIds = new Set(next.map((r) => r.id));

    // Handle deletes
    retiros.forEach((item) => {
      if (!nextIds.has(item.id)) {
        deleteDoc(doc(db, "retiros", String(item.id))).catch((err) => {
          handleFirestoreError(err, OperationType.DELETE, `retiros/${item.id}`);
        });
      }
    });

    // Handle additions / updates
    next.forEach((item) => {
      const currentItem = retiros.find((r) => r.id === item.id);
      if (!currentItem || JSON.stringify(currentItem) !== JSON.stringify(item)) {
        setDoc(doc(db, "retiros", String(item.id)), item).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `retiros/${item.id}`);
        });
      }
    });
  };

  // 2. Disable live warning alerts as requested
  const activeAlerts = useMemo<AlertaAlmacenamiento[]>(() => {
    return [];
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased font-sans flex flex-col justify-between">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <HomeScreen setScreen={setScreen} alerts={activeAlerts} />
            </motion.div>
          )}

          {screen === "interno" && (
            <motion.div
              key="interno"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RegistroInternoForm 
                setScreen={setScreen} 
                onSave={(newReg) => handleSetRegistros(prev => [...prev, { ...newReg, id: Date.now(), tipo: "interno" }])}
                registros={registros}
                retiros={retiros}
              />
            </motion.div>
          )}

          {screen === "externo" && (
            <motion.div
              key="externo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RetiroExternoForm
                setScreen={setScreen}
                onSave={(newRet) => handleSetRetiros(prev => [...prev, { ...newRet, id: Date.now(), tipo: "externo" }])}
              />
            </motion.div>
          )}

          {screen === "panel" && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
            >
              <PanelControl 
                setScreen={setScreen}
                registros={registros}
                retiros={retiros}
                setRegistros={handleSetRegistros}
                setRetiros={handleSetRetiros}
                alerts={activeAlerts}
              />
            </motion.div>
          )}

          {screen === "contacto" && (
            <motion.div
              key="contacto"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <InformacionContacto setScreen={setScreen} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
