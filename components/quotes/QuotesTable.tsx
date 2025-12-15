"use client";

import { useEffect, useState } from "react";
import { useCitas, Cita } from "@/hooks/citaCitas";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Calendar } from "lucide-react";
import { QuoteFormDialog } from "./QuoteFormDialog";
import { QuoteEditDialog } from "./QuoteEditDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuotesTable() {
  const { getCitas, deleteCita, isLoading, citas } = useCitas();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [filteredCitas, setFilteredCitas] = useState<Cita[]>([]);

  useEffect(() => {
    loadCitas();
  }, []);

  useEffect(() => {
    filterCitas();
  }, [citas, searchTerm, dateFilter]);

  const loadCitas = async () => {
    const result = await getCitas();
    console.log("Citas cargadas:", result);
  };

  const filterCitas = () => {
    let filtered = [...citas];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (cita) =>
          cita.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cita.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cita.ci.includes(searchTerm) ||
          cita.motivo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de fecha
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === "today") {
      filtered = filtered.filter((cita) => {
        const citaDate = new Date(cita.fecha_cita);
        citaDate.setHours(0, 0, 0, 0);
        return citaDate.getTime() === today.getTime();
      });
    } else if (dateFilter === "upcoming") {
      filtered = filtered.filter((cita) => {
        const citaDate = new Date(cita.fecha_cita);
        return citaDate >= today;
      });
    } else if (dateFilter === "past") {
      filtered = filtered.filter((cita) => {
        const citaDate = new Date(cita.fecha_cita);
        return citaDate < today;
      });
    }

    setFilteredCitas(filtered);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta cita?")) {
      const result = await deleteCita(id);
      if (result) {
        await loadCitas();
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Gestión de Citas
            </CardTitle>
            <QuoteFormDialog onSuccess={loadCitas} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, apellido, CI o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="upcoming">Próximas</SelectItem>
                <SelectItem value="past">Pasadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando citas...
            </div>
          ) : filteredCitas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron citas.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CI</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCitas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell className="font-medium">{cita.ci}</TableCell>
                      <TableCell>{cita.nombre}</TableCell>
                      <TableCell>{cita.apellido}</TableCell>
                      <TableCell>{formatDate(cita.fecha_cita)}</TableCell>
                      <TableCell>{cita.hora_cita}</TableCell>
                      <TableCell>{cita.motivo || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <QuoteEditDialog cita={cita} onSuccess={loadCitas} />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cita.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredCitas.length} de {citas.length} cita(s)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
