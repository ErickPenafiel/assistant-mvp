"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Provider } from "@/types/provider";

export type ProviderSchedule = {
	id: string;
	provider_id: string;
	weekday: number;
	start_time: string;
	end_time: string;
};

export type TimeInterval = {
	start: string;
	end: string;
};

export type DayScheduleState = {
	enabled: boolean;
	intervals: TimeInterval[];
};

export type WeekScheduleState = {
	[weekday: number]: DayScheduleState;
};

const defaultDay: DayScheduleState = {
	enabled: false,
	intervals: [],
};

export function buildInitialWeekState(): WeekScheduleState {
	return {
		0: { ...defaultDay },
		1: { ...defaultDay },
		2: { ...defaultDay },
		3: { ...defaultDay },
		4: { ...defaultDay },
		5: { ...defaultDay },
		6: { ...defaultDay },
	};
}

export function useProviderSchedules(provider?: Provider) {
	const [loading, setLoading] = useState(false);
	const [schedules, setSchedules] = useState<ProviderSchedule[]>([]);

	const providerId = provider?.id;

	const loadSchedules = useCallback(async () => {
		if (!providerId) {
			setSchedules([]);
			return;
		}

		setLoading(true);
		const supabase = createClient();

		const { data, error } = await supabase
			.from("provider_schedules")
			.select("*")
			.eq("provider_id", providerId)
			.order("weekday", { ascending: true })
			.order("start_time", { ascending: true });

		if (error) {
			console.error(error);
			toast.error("No se pudieron cargar los horarios del proveedor.", {
				description: error.message,
			});
		} else {
			setSchedules((data ?? []) as ProviderSchedule[]);
		}

		setLoading(false);
	}, [providerId]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadSchedules();
	}, [loadSchedules]);

	const saveWeekSchedule = useCallback(
		async (weekState: WeekScheduleState) => {
			if (!providerId) return;

			setLoading(true);
			const supabase = createClient();

			const rowsToInsert = [];

			for (const [weekdayStr, day] of Object.entries(weekState)) {
				const weekday = Number(weekdayStr);
				if (!day.enabled) continue;

				for (const interval of day.intervals) {
					if (!interval.start || !interval.end) continue;

					rowsToInsert.push({
						provider_id: providerId,
						weekday,
						start_time: `${interval.start}:00`,
						end_time: `${interval.end}:00`,
					});
				}
			}

			const { error: deleteError } = await supabase
				.from("provider_schedules")
				.delete()
				.eq("provider_id", providerId);

			if (deleteError) {
				console.error(deleteError);
				toast.error("No se pudieron limpiar los horarios anteriores.", {
					description: deleteError.message,
				});
				setLoading(false);
				return;
			}

			if (rowsToInsert.length > 0) {
				const { error: insertError } = await supabase
					.from("provider_schedules")
					.insert(rowsToInsert);

				if (insertError) {
					console.error(insertError);
					toast.error("No se pudieron guardar los nuevos horarios.", {
						description: insertError.message,
					});
					setLoading(false);
					return;
				}
			}

			toast.success("Horarios guardados correctamente.");
			await loadSchedules();
			setLoading(false);
		},
		[providerId, loadSchedules]
	);

	return {
		loading,
		schedules,
		reload: loadSchedules,
		saveWeekSchedule,
	};
}
