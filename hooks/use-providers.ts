/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Provider } from "@/types/provider";
import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { create } from "domain";

export type ProviderPayload = {
	first_name: string;
	last_name: string;
	email: string;
	phone: string | null;
	type: string;
};

const PAGE_SIZE = 10;

export function useProviders() {
	const [providers, setProviders] = useState<Provider[]>([]);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);

	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	const loadProviders = useCallback(
		async (pageToLoad = page) => {
			setLoading(true);
			// const supabase = createClient();

			// const from = (pageToLoad - 1) * PAGE_SIZE;
			// const to = from + PAGE_SIZE - 1;

			// const { data, error, count } = await supabase
			// 	.from("providers")
			// 	.select("*", { count: "exact" })
			// 	.is("deleted_at", null)
			// 	.order("created_at", { ascending: false })
			// 	.range(from, to);

			// if (error) {
			// 	console.error(error);
			// 	toast.error("No se pudo cargar la lista de proveedores.", {
			// 		description: error.message,
			// 	});
			// } else {
			// 	setProviders(data as Provider[]);
			// 	setTotal(count ?? 0);
			// }
			try {
			const ref = collection(db, "providers");
			const q = query(ref, where("deletedAt", "==", null));
			const snapshot = await getDocs(q);
			const providersData = snapshot.docs.map(doc => ({
	id: doc.id,
	...doc.data(),

} as Provider));
			setProviders(providersData);
			setTotal(providersData.length);
			setLoading(false);
			} catch (error) {
				console.error(error);
			}
		},
		[page]
	);

	useEffect(() => {
		loadProviders(page);
	}, [page, loadProviders]);

	const uploadPhotoIfNeeded = async (
		provider: Provider,
		photoFile?: File | null
	)  => {
		if (!photoFile) return provider;

		// const supabase = createClient();
		// const fileExt = photoFile.name.split(".").pop() ?? "jpg";
		// const filePath = `providers/${provider.id}-${Date.now()}.${fileExt}`;

		// const { error: uploadError } = await supabase.storage
		// 	.from("providers") // nombre del bucket
		// 	.upload(filePath, photoFile);

		// if (uploadError) {
		// 	console.error(uploadError);
		// 	toast.error("Proveedor creado, pero hubo un error al subir la foto.", {
		// 		description: uploadError.message,
		// 	});
		// 	return provider;
		// }

		// const {
		// 	data: { publicUrl },
		// } = supabase.storage.from("providers").getPublicUrl(filePath);

		// const { data: updated, error: updateError } = await supabase
		// 	.from("providers")
		// 	.update({ photo_url: publicUrl })
		// 	.eq("id", provider.id)
		// 	.select("*")
		// 	.single();

		// if (updateError || !updated) {
		// 	console.error(updateError);
		// 	toast.error("La foto se subió pero no se pudo guardar en el perfil.");
		// 	return provider;
		// }

		//return updated as Provider;
	};

	const createProvider = useCallback(
		async (payload: ProviderPayload, photoFile?: File | null) => {
			// const supabase = createClient();

			// const { data, error } = await supabase
			// 	.from("providers")
			// 	.insert(payload)
			// 	.select("*")
			// 	.single();

			// if (error || !data) {
			// 	console.error(error);
			// 	toast.error("Ocurrió un error al crear el proveedor.", {
			// 		description: error?.message,
			// 	});
			// 	throw error;
			// }

			// let created = data as Provider;
			// created = await uploadPhotoIfNeeded(created, photoFile);

			// // Actualizamos estado sin re-fetch
			// setProviders((prev) => {
			// 	// si estamos en la primera página, lo insertamos al inicio
			// 	if (page === 1) {
			// 		const next = [created, ...prev];
			// 		return next.slice(0, PAGE_SIZE);
			// 	}
			// 	return prev;
			// });
			// setTotal((prev) => prev + 1);

			// toast.success("Proveedor creado correctamente.");
			// return created;
const ref = collection(db, "providers");
  const payloadRaw = {
    ...payload,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    deletedAt: null,
  }
  const snapshot = await addDoc(ref, payloadRaw);
  const created = {
	id: snapshot.id,
	...payload, 
	createdAt: payloadRaw.createdAt.toDate().toISOString(),
	updatedAt: payloadRaw.updatedAt.toDate().toISOString(),
	deletedAt: null,
}
setProviders((prev) => {
		return [created, ...prev] as Provider[];

	});
			toast.success("Proveedor creado correctamente.");
			return created;
		},
		[page]
	);

	const updateProvider = useCallback(
		async (id: string, payload: ProviderPayload, photoFile?: File | null) => {
			// const supabase = createClient();

			// const { data, error } = await supabase
			// 	.from("providers")
			// 	.update(payload)
			// 	.eq("id", id)
			// 	.select("*")
			// 	.single();

			// if (error || !data) {
			// 	console.error(error);
			// 	toast.error("Ocurrió un error al actualizar el proveedor.", {
			// 		description: error?.message,
			// 	});
			// 	throw error;
			// }

			// let updated = data as Provider;
			// updated = await uploadPhotoIfNeeded(updated, photoFile);

			// setProviders((prev) => prev.map((p) => (p.id === id ? updated : p)));

			// toast.success("Proveedor actualizado correctamente.");
			// return updated;
		},
		[]
	);

	const softDeleteProvider = useCallback(async (id: string) => {
		// const supabase = createClient();

		// const { error } = await supabase
		// 	.from("providers")
		// 	.update({ deleted_at: new Date().toISOString() })
		// 	.eq("id", id);

		// if (error) {
		// 	console.error(error);
		// 	toast.error("No se pudo eliminar el proveedor.", {
		// 		description: error.message,
		// 	});
		// 	throw error;
		// }

		// setProviders((prev) => prev.filter((p) => p.id !== id));
		// setTotal((prev) => Math.max(0, prev - 1));
		// toast.success("Proveedor eliminado.");
	}, []);

	return {
		providers,
		loading,
		page,
		totalPages,
		setPage,
		createProvider,
		updateProvider,
		softDeleteProvider,
	};
}
