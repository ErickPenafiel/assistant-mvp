"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useCitas, CitaData, Cita } from "@/hooks/citaCitas";
import { Pencil } from "lucide-react";

interface QuoteEditDialogProps {
  cita: Cita;
  onSuccess?: () => void;
}

export function QuoteEditDialog({ cita, onSuccess }: QuoteEditDialogProps) {
  const { updateCita, isLoading, error } = useCitas();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CitaData>({
    ci: cita.ci.toString(),
    nombre: cita.nombre,
    apellido: cita.apellido,
    fecha_cita: cita.fecha_cita,
    hora_cita: cita.hora_cita,
    motivo: cita.motivo || "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        ci: cita.ci.toString(),
        nombre: cita.nombre,
        apellido: cita.apellido,
        fecha_cita: cita.fecha_cita,
        hora_cita: cita.hora_cita,
        motivo: cita.motivo || "",
      });
    }
  }, [open, cita]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateCita(cita.id, formData);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        onSuccess?.();
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cita</DialogTitle>
          <DialogDescription>
            Modifique los datos de la cita y guarde los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ci">Cédula de Identidad (CI)</Label>
              <Input
                id="ci"
                type="text"
                placeholder="Ej: 12345678"
                required
                value={formData.ci}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Apellido"
                  required
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="fecha_cita">Fecha</Label>
                <Input
                  id="fecha_cita"
                  type="date"
                  required
                  value={formData.fecha_cita}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hora_cita">Hora</Label>
                <Input
                  id="hora_cita"
                  type="time"
                  required
                  value={formData.hora_cita}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Input
                id="motivo"
                type="text"
                placeholder="Motivo de la cita"
                value={formData.motivo}
                onChange={handleChange}
              />
            </div>

            <div aria-live="polite" className="min-h-[20px]">
              {error && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {error}
                </p>
              )}
              {success && (
                <p role="alert" className="text-sm font-medium text-green-600">
                  Cita actualizada exitosamente.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando…" : "Actualizar Cita"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
