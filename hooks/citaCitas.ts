import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export type CitaData = {
  ci: string;
  nombre: string;
  apellido: string;
  fecha_cita: string;
  hora_cita: string;
  motivo: string;
};

export type Cita = CitaData & {
  id: number;
  created_at?: string;
};

export function useCitas() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);

  const createCita = async (cita: CitaData) => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error: supabaseError } = await supabase.from("cita").insert({
        ci: (cita.ci),
        nombre: cita.nombre,
        apellido: cita.apellido,
        fecha_cita: cita.fecha_cita,
        hora_cita: cita.hora_cita,
        motivo: cita.motivo,
      });

      if (supabaseError) throw supabaseError;

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCitas = async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { data, error: supabaseError } = await supabase
        .from("cita")
        .select("*")
        .order("fecha_cita", { ascending: false });

      if (supabaseError) throw supabaseError;

      setCitas(data || []);
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCita = async (id: number) => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error: supabaseError } = await supabase
        .from("cita")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCita = async (id: number, cita: CitaData) => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error: supabaseError } = await supabase
        .from("cita")
        .update({
          ci: (cita.ci),
          nombre: cita.nombre,
          apellido: cita.apellido,
          fecha_cita: cita.fecha_cita,
          hora_cita: cita.hora_cita,
          motivo: cita.motivo,
        })
        .eq("id", id);

      if (supabaseError) throw supabaseError;

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCita, getCitas, deleteCita, updateCita, isLoading, error, citas };
}
