"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import { ProvidersCalendar, CalendarEvent } from "./providers-calendar";
import { Provider } from "@/types/provider";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, X } from "lucide-react";

type RawScheduleRow = {
	id: string;
	provider_id: string;
	weekday: number;
	start_time: string;
	end_time: string;
	providers: Provider;
};

export const ProvidersCalendarView: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [providers, setProviders] = useState<Provider[]>([]);
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [selectedProviderId, setSelectedProviderId] = useState<string | "all">(
		"all"
	);
	const [filterOpen, setFilterOpen] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			const supabase = createClient();

			// proveedores activos
			const { data: providersData, error: providersError } = await supabase
				.from("providers")
				.select("*")
				.is("deleted_at", null)
				.order("first_name", { ascending: true });

			if (providersError) {
				console.error(providersError);
				toast.error("No se pudieron cargar los proveedores.", {
					description: providersError.message,
				});
				setLoading(false);
				return;
			}

			setProviders((providersData ?? []) as Provider[]);

			// horarios + join proveedor
			const { data: schedulesData, error: schedulesError } = await supabase
				.from("provider_schedules")
				.select("id, provider_id, weekday, start_time, end_time, providers(*)")
				.order("weekday", { ascending: true })
				.order("start_time", { ascending: true });

			if (schedulesError) {
				console.error(schedulesError);
				toast.error("No se pudieron cargar los horarios.", {
					description: schedulesError.message,
				});
				setLoading(false);
				return;
			}

			const mapped: CalendarEvent[] = (schedulesData ?? []).map((row) => {
				const r = row as unknown as RawScheduleRow;
				return {
					id: r.id,
					weekday: r.weekday,
					start_time: r.start_time,
					end_time: r.end_time,
					provider: r.providers,
				};
			});

			setEvents(mapped);
			setLoading(false);
		};

		void loadData();
	}, []);

	const filteredEvents = useMemo(() => {
		if (selectedProviderId === "all") return events;
		return events.filter(
			(e) => e.provider && e.provider.id === selectedProviderId
		);
	}, [events, selectedProviderId]);

	const selectedProvider =
		selectedProviderId === "all"
			? null
			: providers.find((p) => p.id === selectedProviderId) ?? null;

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-8">
			<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Calendario de horarios</h1>
					<p className="text-sm text-muted-foreground">
						Consulta los horarios configurados de todos los proveedores o filtra
						por uno.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Popover open={filterOpen} onOpenChange={setFilterOpen}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="min-w-[220px] justify-between"
							>
								{selectedProvider
									? `${selectedProvider.first_name} ${selectedProvider.last_name}`
									: "Todos los proveedores"}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[260px] p-0">
							<Command>
								<CommandInput
									placeholder="Buscar proveedor..."
									value={search}
									onValueChange={setSearch}
								/>
								<CommandList>
									<CommandEmpty>No se encontraron resultados.</CommandEmpty>
									<CommandGroup>
										<CommandItem
											value="all"
											onSelect={() => {
												setSelectedProviderId("all");
												setFilterOpen(false);
												setSearch("");
											}}
										>
											<span>Todos los proveedores</span>
										</CommandItem>
										{providers.map((p) => (
											<CommandItem
												key={p.id}
												value={`${p.first_name} ${p.last_name}`}
												onSelect={() => {
													setSelectedProviderId(p.id);
													setFilterOpen(false);
													setSearch("");
												}}
											>
												{p.first_name} {p.last_name}
												{p.type && (
													<span className="ml-1 text-[10px] uppercase text-muted-foreground">
														({p.type})
													</span>
												)}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>

					{selectedProviderId !== "all" && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => setSelectedProviderId("all")}
							title="Limpiar filtro"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>

			<div className="rounded border bg-background p-3">
				{loading ? (
					<div className="py-10 text-center text-muted-foreground text-sm">
						Cargando calendario...
					</div>
				) : events.length === 0 ? (
					<div className="py-10 text-center text-muted-foreground text-sm">
						No hay horarios configurados aún.
					</div>
				) : (
					<ProvidersCalendar events={filteredEvents} />
				)}
			</div>
		</main>
	);
};
