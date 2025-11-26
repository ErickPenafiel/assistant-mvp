"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { ProviderForm, ProviderFormValues } from "./provider-form";
import { Provider } from "@/types/provider";

type ProviderFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData?: Partial<Provider>;
	availableTypes: string[];
	onSubmitProvider: (
		values: ProviderFormValues,
		photoFile: File | null,
		initialData?: Partial<Provider>
	) => Promise<void>;
};

export const ProviderFormDialog: React.FC<ProviderFormDialogProps> = ({
	open,
	onOpenChange,
	initialData,
	availableTypes,
	onSubmitProvider,
}) => {
	const isEdit = Boolean(initialData?.id);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Editar proveedor" : "Nuevo proveedor"}
					</DialogTitle>
				</DialogHeader>

				<ProviderForm
					initialData={initialData}
					availableTypes={availableTypes}
					onCancel={() => onOpenChange(false)}
					onSubmit={async (values, photoFile) => {
						await onSubmitProvider(values, photoFile, initialData);
						onOpenChange(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};
