/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

import { ChevronsUpDown } from "lucide-react";

export type Provider = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string | null;
	type: string;
	photo_url: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
};

export type ProviderFormValues = {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	type: string;
};

type ProviderFormProps = {
	initialData?: Partial<Provider>;
	availableTypes: string[]; // 👈 tipos existentes (venidos de otra tabla)
	onSubmit: (
		values: ProviderFormValues,
		photoFile: File | null
	) => Promise<void>;
	onCancel: () => void;
};

export const ProviderForm: React.FC<ProviderFormProps> = ({
	initialData,
	availableTypes,
	onSubmit,
	onCancel,
}) => {
	const isEdit = Boolean(initialData?.id);
	const [photoFile, setPhotoFile] = useState<File | null>(null);

	const [typePopoverOpen, setTypePopoverOpen] = useState(false);
	const [typeSearch, setTypeSearch] = useState("");

	const form = useForm<ProviderFormValues>({
		defaultValues: {
			first_name: initialData?.first_name ?? "",
			last_name: initialData?.last_name ?? "",
			email: initialData?.email ?? "",
			phone: initialData?.phone ?? "",
			type: initialData?.type ?? "",
		},
	});

	const {
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = form;

	// Resetea cuando cambia el provider a editar
	useEffect(() => {
		reset({
			first_name: initialData?.first_name ?? "",
			last_name: initialData?.last_name ?? "",
			email: initialData?.email ?? "",
			phone: initialData?.phone ?? "",
			type: initialData?.type ?? "",
		});
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setPhotoFile(null);
		setTypeSearch(initialData?.type ?? "");
	}, [initialData, reset]);

	const internalSubmit = async (values: ProviderFormValues) => {
		await onSubmit(
			{
				...values,
				first_name: values.first_name.trim(),
				last_name: values.last_name.trim(),
				email: values.email.trim(),
				phone: values.phone.trim(),
				type: values.type.trim(),
			},
			photoFile
		);
	};

	const normalizedTypes = availableTypes.map((t) => t.trim()).filter(Boolean);

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="first_name"
					rules={{ required: "El nombre es obligatorio" }}
					render={({ field }: { field: any }) => (
						<FormItem>
							<FormLabel>Nombre</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="last_name"
					rules={{ required: "El apellido es obligatorio" }}
					render={({ field }: { field: any }) => (
						<FormItem>
							<FormLabel>Apellido</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					rules={{
						required: "El correo es obligatorio",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "Correo inválido",
						},
					}}
					render={({ field }: { field: any }) => (
						<FormItem>
							<FormLabel>Correo electrónico</FormLabel>
							<FormControl>
								<Input type="email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="phone"
					render={({ field }: { field: any }) => (
						<FormItem>
							<FormLabel>Teléfono</FormLabel>
							<FormControl>
								<Input type="tel" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="type"
					rules={{ required: "El tipo es obligatorio" }}
					render={({ field }: { field: any }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Tipo</FormLabel>
							<Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											type="button"
											variant="outline"
											role="combobox"
											className="w-full justify-between"
										>
											{field.value
												? field.value
												: "Selecciona o escribe un tipo"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-[280px] p-0">
									<Command>
										<CommandInput
											placeholder="Buscar o escribir..."
											value={typeSearch}
											onValueChange={(val) => {
												setTypeSearch(val);
												field.onChange(val); // sincroniza con el formulario
											}}
										/>
										<CommandList>
											<CommandEmpty>No se encontraron tipos.</CommandEmpty>
											<CommandGroup>
												{normalizedTypes.map((t) => (
													<CommandItem
														key={t}
														value={t}
														onSelect={() => {
															field.onChange(t);
															setTypeSearch(t);
															setTypePopoverOpen(false);
														}}
													>
														{t}
													</CommandItem>
												))}

												{typeSearch.trim().length > 0 &&
													!normalizedTypes.some(
														(t) =>
															t.toLowerCase() ===
															typeSearch.trim().toLowerCase()
													) && (
														<CommandItem
															value={typeSearch.trim()}
															onSelect={() => {
																const v = typeSearch.trim();
																field.onChange(v);
																setTypeSearch(v);
																setTypePopoverOpen(false);
															}}
														>
															Crear nuevo tipo {typeSearch.trim()}
														</CommandItem>
													)}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormItem>
					<FormLabel>Foto (opcional)</FormLabel>
					<FormControl>
						<Input
							type="file"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.[0] ?? null;
								setPhotoFile(file);
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>

				<div className="flex justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isEdit
							? isSubmitting
								? "Guardando..."
								: "Guardar cambios"
							: isSubmitting
							? "Creando..."
							: "Crear proveedor"}
					</Button>
				</div>
			</form>
		</Form>
	);
};
