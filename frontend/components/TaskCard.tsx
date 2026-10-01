import { useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { TaskCardProps } from "../types/taskCardProps";
import TaskStatusBadge from "./TaskStatusBadge.tsx";
import { Card, CardContent } from "./shadcn/card";
import { Button } from "./shadcn/button";

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    // Affiche la confirmation de suppression dans la carte (remplace confirm())
    const [confirming, setConfirming] = useState(false);

    return (
        <Card className="group/task transition-shadow hover:ring-foreground/20">
            <CardContent className="flex h-full flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                    <TaskStatusBadge complete={task.complete} />
                    <div className="flex gap-0.5 opacity-40 transition-opacity group-hover/task:opacity-100 group-focus-within/task:opacity-100 [@media(hover:none)]:opacity-100">
                        <Button variant="ghost" size="icon-sm" aria-label="Modifier" onClick={() => onEdit(task)}>
                            <FaPen />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Supprimer"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setConfirming(true)}
                        >
                            <FaTrashAlt />
                        </Button>
                    </div>
                </div>

                <h3 className="text-base font-semibold wrap-break-word text-foreground">{task.name}</h3>
                {task.description
                    ? <p className="text-sm wrap-break-word text-muted-foreground">{task.description}</p>
                    : <p className="text-sm text-muted-foreground/70 italic">Aucune description</p>}

                {confirming ? (
                    <div className="mt-auto flex flex-wrap items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-sm">
                        <span className="flex-1">Supprimer cette tâche ?</span>
                        <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>Annuler</Button>
                        <Button size="sm" className="bg-destructive text-white hover:bg-destructive/85" onClick={() => onDelete(task)}>
                            Supprimer
                        </Button>
                    </div>
                ) : (
                    <span className="mt-auto pt-1 font-mono text-xs text-muted-foreground/70">#{task.id}</span>
                )}
            </CardContent>
        </Card>
    )
}
