"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCitas, CitaData } from "@/hooks/citaCitas";
import { Separator } from "@/components/ui/separator";

export function QuotesForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { createCita, isLoading, error } = useCitas();
  const [formData, setFormData] = useState<CitaData>({
    ci: "",
    nombre: "",
    apellido: "",
    fecha_cita: "",
    hora_cita: "",
    motivo: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createCita(formData);
    if (result) {
      setSuccess(true);
      setFormData({
        ci: "",
        nombre: "",
        apellido: "",
        fecha_cita: "",
        hora_cita: "",
        motivo: "",
      });
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="w-full shadow-lg border bg-card/95 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-semibold tracking-tight">Agendar Cita</CardTitle>
          <CardDescription className="text-base">Complete el formulario para registrar una nueva cita médica.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-8 md:grid-cols-5">
            {/* Columna Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6 md:col-span-3" aria-describedby="form-description">
              <p id="form-description" className="sr-only">Formulario para registrar cita con datos personales y fecha.</p>
              <div className="grid gap-6">
              
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

              <div className="grid gap-4 md:grid-cols-2 w-full">
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

              <div className="grid gap-4 md:grid-cols-2 w-full">
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
                    Cita creada exitosamente.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Guardando…" : "Guardar Cita"}
              </Button>
            </div>
            </form>
            {/* Columna Lateral */}
            <aside className="md:col-span-2 flex flex-col gap-4 rounded-lg border bg-muted/40 p-5">
              <h3 className="text-lg font-semibold">Consejos rápidos</h3>
              <Separator />
              <ul className="space-y-3 text-sm leading-relaxed list-disc list-inside">
                <li>Verifique que la cédula esté correctamente escrita.</li>
                <li>Seleccione una fecha futura disponible.</li>
                <li>Use un motivo claro (ej: Control general, Consulta).</li>
                <li>Puede editar la cita luego si es necesario.</li>
              </ul>
              <div className="mt-2 rounded-md bg-gradient-to-r from-primary/15 to-primary/5 p-3 text-xs text-muted-foreground">
                Sus datos se almacenan de forma segura. No comparta información sensible innecesaria.
              </div>
            </aside>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
