import { TasksHeaderProps } from "../types/tasksHeaderProps";
import { Button } from "./shadcn/button";

export default function TasksHeader({ total, completed, onAdd, headingRef }: TasksHeaderProps) {
    const percent = total ? Math.round((completed / total) * 100) : 0;

    return (
        <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
                {/* tabIndex -1 : permet d'y replacer le focus (ex. après une suppression) sans l'ajouter à l'ordre de tabulation */}
                <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight text-foreground">Mes tâches</h1>
                <p className="text-sm text-muted-foreground tabular-nums">
                    {total} tâche{total > 1 && "s"} · {completed} complète{completed > 1 && "s"}
                </p>
                <div className="mt-1.5 flex items-center gap-2.5">
                    <div
                        role="progressbar"
                        aria-label="Progression des tâches complètes"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percent}
                        className="h-1.5 w-40 overflow-hidden rounded-full bg-muted"
                    >
                        <div className="h-full rounded-full bg-[#0a6e38] transition-[width]" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{percent} %</span>
                </div>
            </div>
            <Button size="lg" className="px-3.5" onClick={onAdd}>
                Ajouter une tâche
            </Button>
        </header>
    )
}
