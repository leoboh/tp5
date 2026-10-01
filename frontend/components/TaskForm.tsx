import { SubmitEvent, useState } from "react";
import { Task } from "../types/tasks";
import { TaskFormProps } from "../types/taskFormProps";
import TaskStatusBadge from "./TaskStatusBadge.tsx";
import { Input } from "./shadcn/input";
import { Button } from "./shadcn/button";

// Même limite que le schéma Joi de l'API
const NAME_MAX_LENGTH = 255;
const ASSIGNEE_MAX_LENGTH = 50;

export default function TaskForm({ task, onSaved, onCancel, nameInputRef }: TaskFormProps) {
    const [name, setName] = useState(task?.name ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [assignee, setAssignee] = useState(task?.assignee ?? "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Erreur de saisie du champ "Nom", affichée sous le champ et reliée par aria-describedby
    const [nameError, setNameError] = useState<string | null>(null);

    // Même règle que la colonne générée "complete" en base
    const willBeComplete = name.trim() !== "" && description.trim() !== "";

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); // évite le rechargement de la page

        if (name.trim() === "") {
            setNameError("Le nom de la tâche est obligatoire.");
            nameInputRef?.current?.focus();
            return;
        }
        if (name.trim().length > NAME_MAX_LENGTH) {
            setNameError(`Le nom de la tâche ne doit pas dépasser ${NAME_MAX_LENGTH} caractères.`);
            nameInputRef?.current?.focus();
            return;
        }
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(task ? `http://localhost:3000/tasks/${task.id}` : "http://localhost:3000/tasks", {
                method: task ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description: description || null, assignee: assignee.trim() || null }),
            });
            if (!res.ok) {
                // L'API renvoie le message de validation Joi en cas d'erreur 400
                const body = await res.json().catch(() => null);
                throw new Error(body?.error ?? (task ? "Erreur lors de la modification" : "Erreur lors de l'ajout de la tâche"));
            }

            const savedTask: Task = await res.json();
            onSaved(savedTask);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-name" className="text-sm font-medium">Nom (obligatoire)</label>
                <Input
                    id="task-name"
                    type="text"
                    placeholder="Ex. Préparer la démo"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(null);
                    }}
                    ref={nameInputRef}
                    required
                    maxLength={NAME_MAX_LENGTH}
                    aria-invalid={nameError ? true : undefined}
                    aria-describedby={nameError ? "task-name-error" : undefined}
                />
                {nameError && <p id="task-name-error" role="alert" className="text-sm text-destructive">{nameError}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-description" className="text-sm font-medium">Description</label>
                <textarea
                    id="task-description"
                    placeholder="Optionnelle, mais nécessaire pour que la tâche soit complète"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-assignee" className="text-sm font-medium">Prénom du bénévole</label>
                <Input
                    id="task-assignee"
                    type="text"
                    placeholder="Optionnel, prénom uniquement"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    maxLength={ASSIGNEE_MAX_LENGTH}
                    autoComplete="off"
                />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Statut après enregistrement : <TaskStatusBadge complete={willBeComplete} />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">Erreur : {error}</p>}
            <div className="mt-auto flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Enregistrement..." : task ? "Enregistrer" : "Ajouter"}
                </Button>
            </div>
        </form>
    )
}
