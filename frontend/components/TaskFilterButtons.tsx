import { cn } from "cn";
import { TaskFilter, TaskFilterButtonsProps } from "../types/taskFilterButtonsProps";

const FILTERS: { value: TaskFilter; label: string }[] = [
    { value: "all", label: "Toutes" },
    { value: "complete", label: "Complètes" },
    { value: "incomplete", label: "Non complètes" },
];

export default function TaskFilterButtons({ filter, onFilterChange, counts }: TaskFilterButtonsProps) {
    return (
        <div role="group" aria-label="Filtrer les tâches" className="inline-flex gap-0.5 rounded-lg bg-muted p-0.5">
            {FILTERS.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    aria-pressed={filter === value}
                    onClick={() => onFilterChange(value)}
                    className={cn(
                        "inline-flex h-7 items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground",
                        filter === value && "bg-background text-foreground shadow-sm"
                    )}
                >
                    {label}
                    <span className="rounded-full bg-border px-1.5 font-mono text-xs text-foreground tabular-nums">
                        {counts[value]}
                    </span>
                </button>
            ))}
        </div>
    )
}
