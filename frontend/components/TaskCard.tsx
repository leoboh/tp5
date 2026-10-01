import { useEffect, useRef, useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { TaskCardProps } from "../types/taskCardProps";
import TaskStatusBadge from "./TaskStatusBadge.tsx";
import { Card, CardContent } from "./shadcn/card";
import { Button } from "./shadcn/button";

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    // Affiche la confirmation de suppression dans la carte (remplace confirm())
    const [confirming, setConfirming] = useState(false);
    const deleteButtonRef = useRef<HTMLButtonElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    // Le focus arrive sur l'action non destructive dès l'apparition de la confirmation
    useEffect(() => {
        if (confirming) cancelButtonRef.current?.focus();
    }, [confirming]);

    const cancelDelete = () => {
        // On rend le focus au bouton corbeille avant que la zone de confirmation disparaisse
        deleteButtonRef.current?.focus();
        setConfirming(false);
    };

    return (
        <Card className="group/task h-full transition-shadow hover:ring-foreground/20">
            <CardContent className="flex h-full flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                    <TaskStatusBadge complete={task.complete} />
                    <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon-sm" className="cursor-pointer" aria-label={`Modifier la tâche ${task.name}`} onClick={() => onEdit(task)}>
                            <FaPen aria-hidden="true" />
                        </Button>
                        <Button
                            ref={deleteButtonRef}
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Supprimer la tâche ${task.name}`}
                            className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setConfirming(true)}
                        >
                            <FaTrashAlt aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                <h3 className="text-base font-semibold wrap-break-word text-foreground">{task.name}</h3>
                {task.description
                    ? <p className="text-sm wrap-break-word text-muted-foreground">{task.description}</p>
                    : <p className="text-sm text-muted-foreground italic">Aucune description</p>}

                {confirming ? (
                    <div role="group" aria-label={`Confirmer la suppression de la tâche ${task.name}`} className="mt-auto flex flex-wrap items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-sm">
                        <span className="flex-1">Supprimer cette tâche ?</span>
                        <Button
                            ref={cancelButtonRef}
                            variant="outline"
                            size="sm"
                            aria-label={`Annuler la suppression de la tâche ${task.name}`}
                            onClick={cancelDelete}
                        >
                            Annuler
                        </Button>
                        <Button
                            size="sm"
                            className="bg-destructive text-white hover:bg-destructive/85"
                            aria-label={`Supprimer définitivement la tâche ${task.name}`}
                            onClick={() => onDelete(task)}
                        >
                            Supprimer
                        </Button>
                    </div>
                ) : (
                    <span className="mt-auto pt-1 font-mono text-xs text-muted-foreground">#{task.id}</span>
                )}
            </CardContent>
        </Card>
    )
}
