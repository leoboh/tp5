import { SubmitEvent, useState } from "react";
import { Task } from "../types/tasks";
import { TaskFormProps } from "../types/taskFormProps";
import TaskStatusBadge from "./TaskStatusBadge.tsx";
import { Input } from "./shadcn/input";
import { Button } from "./shadcn/button";

export default function TaskForm({ task, onSaved, onCancel, nameInputRef }: TaskFormProps) {
    const [name, setName] = useState(task?.name ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Même règle que la colonne générée "complete" en base
    const willBeComplete = name.trim() !== "" && description.trim() !== "";

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); // évite le rechargement de la page
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(task ? `http://localhost:3000/tasks/${task.id}` : "http://localhost:3000/tasks", {
                method: task ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description: description || null }),
            });
            if (!res.ok) throw new Error(task ? "Erreur lors de la modification" : "Erreur lors de l'ajout de la tâche");

            const savedTask: Task = await res.json();
            onSaved(savedTask);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-name" className="text-sm font-medium">Nom</label>
                <Input
                    id="task-name"
                    type="text"
                    placeholder="Ex. Préparer la démo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    ref={nameInputRef}
                    required
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-description" className="text-sm font-medium">Description</label>
                <textarea
                    id="task-description"
                    placeholder="Optionnelle, mais nécessaire pour que la tâche soit complète"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Statut après enregistrement : <TaskStatusBadge complete={willBeComplete} />
            </div>
            {error && <p className="text-sm text-destructive">Erreur : {error}</p>}
            <div className="mt-auto flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Enregistrement..." : task ? "Enregistrer" : "Ajouter"}
                </Button>
            </div>
        </form>
    )
}
