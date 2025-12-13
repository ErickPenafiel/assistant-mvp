// hooks/use-provider-types.ts
"use client";

import { useEffect, useState, useCallback } from "react";
//import { createClient } from "@/lib/supabase/client";
//import { toast } from "sonner";

export function useProviderTypes() {
	const [types, setTypes] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			// const supabase = createClient();

			// const { data, error } = await supabase
			// 	.from("provider_types")
			// 	.select("name")
			// 	.order("name", { ascending: true });

			// if (error) {
			// 	console.error(error);
			// 	toast.error("No se pudo cargar la lista de tipos de proveedor.", {
			// 		description: error.message,
			// 	});
			// } else {
			// 	setTypes((data ?? []).map((row) => row.name));
			// }
			setLoading(false);
		};

		load();
	}, []);

	const ensureTypeExists = useCallback(
		async (name: string) => {
			const trimmed = name.trim();
			if (!trimmed) return;

			const alreadyExists = types.some(
				(t) => t.toLowerCase() === trimmed.toLowerCase()
			);

			if (alreadyExists) return;

			// const supabase = createClient();

			// const { error } = await supabase
			// 	.from("provider_types")
			// 	.insert({ name: trimmed });

			// if (error) {
			// 	console.error(error);
			// 	// si ya existe por unique constraint, ignoramos
			// 	if (error.code === "23505" || error.message.includes("duplicate")) {
			// 		return;
			// 	}
			// 	toast.error("No se pudo guardar el nuevo tipo.", {
			// 		description: error.message,
			// 	});
			// 	return;
			// }

			setTypes((prev) => [...prev, trimmed]);
		},
		[types]
	);

	return { types, loading, ensureTypeExists };
}
