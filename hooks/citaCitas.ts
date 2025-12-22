"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addDoc, collection, getDocs, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export type CitaData = {
  ci: string;
  nombre: string;
  apellido: string;
  fecha_cita: string;
  hora_cita: string;
  motivo: string;
};

export type Cita = CitaData & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export function useCitas() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);

  const createCita = async (cita: CitaData) => {
    setIsLoading(true);
    setError(null);

    try {
      const ref = collection(db, "cita");
      const payloadRaw = {
        ...cita,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const snapshot = await addDoc(ref, payloadRaw);
      
      const created: Cita = {
        id: snapshot.id,
        ...cita,
        createdAt: payloadRaw.createdAt.toDate().toISOString(),
        updatedAt: payloadRaw.updatedAt.toDate().toISOString(),
      };

      setCitas((prev) => [created, ...prev]);
      toast.success("Cita creada correctamente.");
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Ocurrió un error al crear la cita.", {
        description: err.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCitas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const ref = collection(db, "cita");
      const q = query(ref, orderBy("fecha_cita", "desc"));
      const snapshot = await getDocs(q);
      
      const citasData: Cita[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Cita));

      setCitas(citasData);
      return citasData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("No se pudo cargar la lista de citas.", {
        description: err.message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCita = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const docRef = doc(db, "cita", id);
      await deleteDoc(docRef);

      setCitas((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cita eliminada correctamente.");
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("No se pudo eliminar la cita.", {
        description: err.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCita = async (id: string, cita: CitaData) => {
    setIsLoading(true);
    setError(null);

    try {
      const docRef = doc(db, "cita", id);
      const updatePayload = {
        ...cita,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updatePayload);

      const updated: Cita = {
        id,
        ...cita,
        updatedAt: updatePayload.updatedAt.toDate().toISOString(),
      };

      setCitas((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success("Cita actualizada correctamente.");
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Ocurrió un error al actualizar la cita.", {
        description: err.message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCita, getCitas, deleteCita, updateCita, isLoading, error, citas };
}
