"use client";

import React, { useMemo, useState } from "react";
import { ProviderSchedule } from "@/hooks/use-provider-schedules";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const weekdayNamesShort = ["D", "L", "M", "X", "J", "V", "S"];

function formatTime(t: string) {
	const [h, m] = t.split(":");
	return `${h}:${m}`;
}

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

export const ProviderScheduleCalendar: React.FC<{
	schedules: ProviderSchedule[];
}> = ({ schedules }) => {
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
		const startWeekday = firstDay.getDay(); // 0 domingo

		const cells: { date: Date; events: ProviderSchedule[] }[] = [];

		for (let i = 0; i < startWeekday; i++) {
			cells.push({ date: new Date(year, month, 0), events: [] });
		}

		for (let day = 1; day <= totalDays; day++) {
			const date = new Date(year, month, day);
			const weekday = date.getDay(); // 0-6

			const events = schedules.filter((s) => s.weekday === weekday);
			cells.push({ date, events });
		}

		return cells;
	}, [year, month, schedules]);

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
							className={`min-h-[80px] rounded border p-1 ${
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
											{formatTime(e.start_time)} - {formatTime(e.end_time)}
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
