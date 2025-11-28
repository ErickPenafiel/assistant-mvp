"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Provider } from "@/types/provider";

type ProvidersTableProps = {
	providers: Provider[];
	loading: boolean;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onEdit: (provider: Provider) => void;
	onDelete: (provider: Provider) => void;
	onManageSchedule: (provider: Provider) => void;
};

export const ProvidersTable: React.FC<ProvidersTableProps> = ({
	providers,
	loading,
	page,
	totalPages,
	onPageChange,
	onEdit,
	onDelete,
	onManageSchedule,
}) => {
	const canPrev = page > 1;
	const canNext = page < totalPages;

	return (
		<>
			<div className="overflow-hidden rounded-md border bg-background w-full">
				<table className="min-w-full text-sm">
					<thead className="bg-muted">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
								Foto
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
								Nombre
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
								Correo
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
								Teléfono
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
								Tipo
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
								Creado
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={7}
									className="px-4 py-6 text-center text-muted-foreground"
								>
									Cargando proveedores...
								</td>
							</tr>
						) : providers.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className="px-4 py-6 text-center text-muted-foreground"
								>
									No hay proveedores registrados.
								</td>
							</tr>
						) : (
							providers.map((p) => (
								<tr key={p.id} className="border-t">
									<td className="px-4 py-3">
										<Avatar>
											{p.photo_url && (
												<AvatarImage src={p.photo_url} alt={p.first_name} />
											)}
											<AvatarFallback>
												{p.first_name?.[0]}
												{p.last_name?.[0]}
											</AvatarFallback>
										</Avatar>
									</td>
									<td className="px-4 py-3">
										<div className="font-medium">
											{p.first_name} {p.last_name}
										</div>
									</td>
									<td className="px-4 py-3">{p.email}</td>
									<td className="px-4 py-3">{p.phone ?? "—"}</td>
									<td className="px-4 py-3 capitalize">{p.type}</td>
									<td className="px-4 py-3 text-xs text-muted-foreground">
										{new Date(p.created_at).toLocaleString("es-ES")}
									</td>
									<td className="px-4 py-3">
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => onManageSchedule(p)}
											>
												Horarios
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => onEdit(p)}
											>
												Editar
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => onDelete(p)}
											>
												Eliminar
											</Button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="mt-4 flex justify-end">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => canPrev && onPageChange(page - 1)}
									aria-disabled={!canPrev}
									className={!canPrev ? "pointer-events-none opacity-50" : ""}
								/>
							</PaginationItem>

							{Array.from({ length: totalPages }).map((_, i) => {
								const pageNumber = i + 1;
								return (
									<PaginationItem key={pageNumber}>
										<PaginationLink
											isActive={pageNumber === page}
											onClick={() => onPageChange(pageNumber)}
										>
											{pageNumber}
										</PaginationLink>
									</PaginationItem>
								);
							})}

							<PaginationItem>
								<PaginationNext
									onClick={() => canNext && onPageChange(page + 1)}
									aria-disabled={!canNext}
									className={!canNext ? "pointer-events-none opacity-50" : ""}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</>
	);
};
