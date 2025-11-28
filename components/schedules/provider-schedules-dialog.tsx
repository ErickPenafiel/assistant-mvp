/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
	useProviderSchedules,
	buildInitialWeekState,
	WeekScheduleState,
	TimeInterval,
} from "@/hooks/use-provider-schedules";
import { Provider } from "@/types/provider";

const weekdayLabels: { [k: number]: string } = {
	1: "Lunes",
	2: "Martes",
	3: "Miércoles",
	4: "Jueves",
	5: "Viernes",
	6: "Sábado",
	0: "Domingo",
};

type ProviderSchedulesDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	provider?: Provider;
};

type FormValues = {
	week: WeekScheduleState;
};

function intervalsOverlap(
	aStart: string,
	aEnd: string,
	bStart: string,
	bEnd: string
) {
	return aStart < bEnd && bStart < aEnd;
}

export const ProviderSchedulesDialog: React.FC<
	ProviderSchedulesDialogProps
> = ({ open, onOpenChange, provider }) => {
	const { schedules, loading, saveWeekSchedule } =
		useProviderSchedules(provider);

	const form = useForm<FormValues>({
		defaultValues: {
			week: buildInitialWeekState(),
		},
	});

	const {
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { isSubmitting },
	} = form;

	// BD -> estado del formulario
	useEffect(() => {
		const base = buildInitialWeekState();

		for (const s of schedules) {
			const [sh, sm] = s.start_time.split(":");
			const [eh, em] = s.end_time.split(":");

			base[s.weekday].enabled = true;
			base[s.weekday].intervals.push({
				start: `${sh}:${sm}`,
				end: `${eh}:${em}`,
			});
		}

		reset({ week: base });
	}, [schedules, reset]);

	const week = watch("week");

	const addInterval = (weekday: number) => {
		const day = week[weekday];
		const next: TimeInterval[] = [
			...(day?.intervals ?? []),
			{ start: "09:00", end: "10:00" },
		];

		setValue(`week.${weekday}.enabled` as any, true);
		setValue(`week.${weekday}.intervals` as any, next);
	};

	const updateInterval = (
		weekday: number,
		index: number,
		field: "start" | "end",
		value: string
	) => {
		const day = week[weekday];
		const intervals = [...(day?.intervals ?? [])];
		if (!intervals[index]) return;

		intervals[index] = { ...intervals[index], [field]: value };
		setValue(`week.${weekday}.intervals` as any, intervals);
	};

	const removeInterval = (weekday: number, index: number) => {
		const day = week[weekday];
		const intervals = [...(day?.intervals ?? [])];
		intervals.splice(index, 1);
		setValue(`week.${weekday}.intervals` as any, intervals);
		if (intervals.length === 0) {
			setValue(`week.${weekday}.enabled` as any, false);
		}
	};

	const onSubmit = async (values: FormValues) => {
		const weekState = values.week;

		// Validaciones locales
		for (const [weekdayStr, day] of Object.entries(weekState)) {
			const weekday = Number(weekdayStr);
			if (!day.enabled) continue;

			const intervals = day.intervals;

			for (let i = 0; i < intervals.length; i++) {
				const a = intervals[i];

				if (!a.start || !a.end) {
					return toast.error(
						`Hay un intervalo incompleto en ${weekdayLabels[weekday]}`
					);
				}

				if (a.start >= a.end) {
					return toast.error(
						`El fin debe ser mayor que el inicio en ${weekdayLabels[weekday]}`
					);
				}

				for (let j = i + 1; j < intervals.length; j++) {
					const b = intervals[j];

					if (intervalsOverlap(a.start, a.end, b.start, b.end)) {
						return toast.error(
							`Los intervalos se solapan en ${weekdayLabels[weekday]}`
						);
					}
				}
			}
		}

		await saveWeekSchedule(weekState);
		onOpenChange(false);
	};

	if (!provider) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						Horarios de{" "}
						<span className="font-semibold">
							{provider.first_name} {provider.last_name}
						</span>
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-3 max-h-[420px] overflow-y-auto pr-1"
				>
					{[1, 2, 3, 4, 5, 6, 0].map((weekday) => {
						const day = week[weekday];
						return (
							<div
								key={weekday}
								className="rounded border p-2 space-y-2 text-xs"
							>
								<div className="flex items-center justify-between gap-2">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											className="h-4 w-4"
											checked={day?.enabled}
											onChange={(e) =>
												setValue(
													`week.${weekday}.enabled` as any,
													e.target.checked
												)
											}
										/>
										<span className="text-sm">{weekdayLabels[weekday]}</span>
									</label>

									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => addInterval(weekday)}
									>
										+ Intervalo
									</Button>
								</div>

								{day?.enabled && day.intervals.length === 0 && (
									<p className="text-[11px] text-muted-foreground">
										Sin intervalos. Usa &quot;+ Intervalo&quot; para agregar
										uno.
									</p>
								)}

								{day?.enabled &&
									day.intervals.map((interval, idx) => (
										<div
											key={idx}
											className="flex items-center gap-2 rounded bg-muted/40 p-1"
										>
											<div className="flex-1">
												<div className="text-[10px] uppercase tracking-wide">
													Desde
												</div>
												<Input
													type="time"
													value={interval.start}
													onChange={(e) =>
														updateInterval(
															weekday,
															idx,
															"start",
															e.target.value
														)
													}
												/>
											</div>
											<div className="flex-1">
												<div className="text-[10px] uppercase tracking-wide">
													Hasta
												</div>
												<Input
													type="time"
													value={interval.end}
													onChange={(e) =>
														updateInterval(weekday, idx, "end", e.target.value)
													}
												/>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="mt-5"
												onClick={() => removeInterval(weekday, idx)}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
							</div>
						);
					})}

					<div className="flex justify-end gap-2 pt-1">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting || loading}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting || loading}>
							{isSubmitting ? "Guardando..." : "Guardar horarios"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
