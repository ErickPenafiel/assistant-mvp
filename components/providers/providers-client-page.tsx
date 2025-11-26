"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ProviderFormValues } from "@/components/providers/provider-form";
import { ProviderFormDialog } from "@/components/providers/provider-form-dialog";
import { ProvidersTable } from "@/components/providers/providers-table";
import { useProviders } from "@/hooks/use-providers";
import { useProviderTypes } from "@/hooks/use-provider-types";
import { Provider } from "@/types/provider";

export default function ProvidersClientPage() {
	const {
		providers,
		loading,
		page,
		totalPages,
		setPage,
		createProvider,
		updateProvider,
		softDeleteProvider,
	} = useProviders();

	const { types: providerTypes, ensureTypeExists } = useProviderTypes();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingProvider, setEditingProvider] = useState<Provider | undefined>(
		undefined
	);

	const handleNew = () => {
		setEditingProvider(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (provider: Provider) => {
		setEditingProvider(provider);
		setDialogOpen(true);
	};

	const handleDelete = (provider: Provider) => {
		toast("¿Eliminar proveedor?", {
			description: `${provider.first_name} ${provider.last_name}`,
			action: {
				label: "Eliminar",
				onClick: async () => {
					try {
						await softDeleteProvider(provider.id);
					} catch {}
				},
			},
			cancel: "Cancelar",
			duration: 8000,
		});
	};

	const handleSubmitProvider = async (
		values: ProviderFormValues,
		photoFile: File | null,
		initialData?: Partial<Provider>
	) => {
		const typeName = values.type.trim();

		await ensureTypeExists(typeName);

		const payload = {
			first_name: values.first_name.trim(),
			last_name: values.last_name.trim(),
			email: values.email.trim(),
			phone: values.phone.trim() || null,
			type: typeName,
		};

		if (initialData?.id) {
			await updateProvider(initialData.id, payload, photoFile ?? undefined);
		} else {
			await createProvider(payload, photoFile ?? undefined);
		}
	};

	return (
		<main className="mx-auto px-4 py-8 w-full">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Proveedores de servicio</h1>
					<p className="text-sm text-muted-foreground">
						Gestiona doctores, profesores, terapeutas u otros prestadores.
					</p>
				</div>

				<Button onClick={handleNew}>+ Nuevo proveedor</Button>
			</div>

			<ProvidersTable
				providers={providers}
				loading={loading}
				page={page}
				totalPages={totalPages}
				onPageChange={setPage}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			<ProviderFormDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				initialData={editingProvider}
				availableTypes={providerTypes}
				onSubmitProvider={handleSubmitProvider}
			/>
		</main>
	);
}
