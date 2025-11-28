"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Provider } from "@/types/provider";

export type CalendarEvent = {
	id: string;
	weekday: number;
	start_time: string;
	end_time: string;
	provider?: Provider;
};

const weekdayNamesShort = ["D", "L", "M", "X", "J", "V", "S"];

function formatTime(t: string) {
	const [h, m] = t.split(":");
	return `${h}:${m}`;
}

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

export const ProvidersCalendar: React.FC<{
	events: CalendarEvent[];
}> = ({ events }) => {
	const [currentMonth, setCurrentMonth] = useState(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), 1);
	});

	const { year, month, monthName } = useMemo(() => {
		const formatter = new Intl.DateTimeFormat("es-ES", {
			month: "long",
			year: "numeric",
		});
		const parts = formatter.formatToParts(currentMonth);
		const monthPart = parts.find((p) => p.type === "month")?.value ?? "";
		const yearPart = Number(
			parts.find((p) => p.type === "year")?.value ?? currentMonth.getFullYear()
		);

		return {
			year: yearPart,
			month: currentMonth.getMonth(),
			monthName: monthPart,
		};
	}, [currentMonth]);

	const days = useMemo(() => {
		const totalDays = getDaysInMonth(year, month);
		const firstDay = new Date(year, month, 1);
		const startWeekday = firstDay.getDay();

		const cells: { date: Date; events: CalendarEvent[] }[] = [];

		for (let i = 0; i < startWeekday; i++) {
			cells.push({ date: new Date(year, month, 0), events: [] });
		}

		for (let day = 1; day <= totalDays; day++) {
			const date = new Date(year, month, day);
			const weekday = date.getDay();

			const dayEvents = events.filter((e) => e.weekday === weekday);
			cells.push({ date, events: dayEvents });
		}

		return cells;
	}, [year, month, events]);

	const handlePrev = () => {
		setCurrentMonth((prev) => {
			const d = new Date(prev);
			d.setMonth(d.getMonth() - 1);
			return new Date(d.getFullYear(), d.getMonth(), 1);
		});
	};

	const handleNext = () => {
		setCurrentMonth((prev) => {
			const d = new Date(prev);
			d.setMonth(d.getMonth() + 1);
			return new Date(d.getFullYear(), d.getMonth(), 1);
		});
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="font-medium capitalize">{monthName}</h3>
				<div className="flex gap-1">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handlePrev}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handleNext}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-1 text-xs">
				{weekdayNamesShort.map((name) => (
					<div
						key={name}
						className="text-center font-semibold text-muted-foreground"
					>
						{name}
					</div>
				))}
				{days.map((cell, idx) => {
					const isPlaceholder = cell.date.getMonth() !== month;
					const dayNumber = cell.date.getDate();
					return (
						<div
							key={idx}
							className={`min-h-[90px] rounded border p-1 ${
								isPlaceholder ? "bg-muted/50 text-muted-foreground" : ""
							}`}
						>
							<div className="text-right text-[11px] font-semibold">
								{!isPlaceholder && dayNumber}
							</div>
							<div className="mt-1 space-y-1">
								{!isPlaceholder &&
									cell.events.map((e) => (
										<div
											key={e.id}
											className="rounded bg-primary/10 px-1 py-0.5 text-[10px]"
										>
											<div className="font-semibold">
												{formatTime(e.start_time)} - {formatTime(e.end_time)}
											</div>
											{e.provider && (
												<div className="truncate text-[9px]">
													{e.provider.first_name} {e.provider.last_name}
												</div>
											)}
										</div>
									))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
