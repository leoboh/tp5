import { useEffect, useRef, useState } from "react";
import { Task } from "../types/tasks";
import { TaskFilter } from "../types/taskFilterButtonsProps";
import TasksHeader from "./TasksHeader.tsx";
import TaskFilterButtons from "./TaskFilterButtons.tsx";
import TaskCard from "./TaskCard.tsx";
import TaskFormDrawer from "./TaskFormDrawer.tsx";
import { Button } from "./shadcn/button";

export default function TasksList() {
    // Liste des tâches récupérées depuis l'API
    const [tasks, setTasks] = useState<Task[]>([]);
    // Chargement initial en cours (true jusqu'à la fin du premier fetch)
    const [loading, setLoading] = useState(true);
    // Erreur lors du chargement initial de la liste
    const [error, setError] = useState<string | null>(null);

    // Message de succès annoncé aux lecteurs d'écran (role="status")
    const [statusMessage, setStatusMessage] = useState("");
    // Erreur d'une action (suppression, etc.) annoncée aux lecteurs d'écran (role="alert")
    const [actionError, setActionError] = useState<string | null>(null);

    // Cible du focus quand la carte focalisée est supprimée
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Filtre d'affichage des tâches
    const [filter, setFilter] = useState<TaskFilter>("all");

    // Ouverture du drawer d'ajout / modification
    const [drawerOpen, setDrawerOpen] = useState(false);
    // Tâche en cours de modification dans le drawer (null = ajout d'une nouvelle tâche)
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/tasks") // adapte le port de ton back
        .then((res) => {
            if (!res.ok) throw new Error("Erreur lors du chargement");
            return res.json();
        })
        .then((data) => setTasks(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []); // [] = exécuté une seule fois au montage

    // Ouvre le drawer en mode modification (task fournie) ou ajout (null)
    const openDrawer = (task: Task | null) => {
        setEditingTask(task);
        setDrawerOpen(true);
    };

    // Met à jour la liste après l'enregistrement du formulaire (ajout ou modification)
    const handleSaved = (saved: Task) => {
        setTasks(editingTask
            ? tasks.map((t) => (t.id === saved.id ? saved : t))
            : [...tasks, saved]);
        setActionError(null);
        setStatusMessage(`Dernière action : « ${saved.name} » ${editingTask ? "modifiée" : "ajoutée"}.`);
        setDrawerOpen(false);
    };

    // Supprime la tâche côté API puis la retire de la liste
    const handleDelete = async (task: Task) => {
        try {
            // Requête de suppression de la tâche
            const res = await fetch(`http://localhost:3000/tasks/${task.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erreur lors de la suppression");

            setTasks(tasks.filter((t) => t.id !== task.id));
            setActionError(null);
            setStatusMessage(`Tâche « ${task.name} » supprimée.`);
            // La carte (et le bouton focalisé) disparaît : on replace le focus sur le titre de la page
            headingRef.current?.focus();
        } catch (err) {
            setStatusMessage("");
            setActionError(err instanceof Error ? err.message : "Erreur inconnue");
        }
    };

    // Retire le bénévole assigné côté API puis met à jour la tâche dans la liste
    const handleRemoveAssignee = async (task: Task) => {
        try {
            // Requête de retrait du bénévole
            const res = await fetch(`http://localhost:3000/tasks/${task.id}/assignee`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erreur lors du retrait du bénévole");

            // Tâche mise à jour renvoyée par l'API
            const updated: Task = await res.json();
            setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
            setActionError(null);
            setStatusMessage(`Bénévole retiré de la tâche « ${task.name} ».`);
        } catch (err) {
            setStatusMessage("");
            setActionError(err instanceof Error ? err.message : "Erreur inconnue");
        }
    };

    // Nombre de tâches complètes
    const completed = tasks.filter((t) => t.complete).length;
    // Compteurs affichés sur chaque bouton de filtre
    const counts = { all: tasks.length, complete: completed, incomplete: tasks.length - completed };

    // Tâches affichées selon le filtre sélectionné
    const displayedTasks = tasks.filter((t) => {
        if (filter === "complete") return t.complete;
        if (filter === "incomplete") return !t.complete;
        return true;
    });

    // Message affiché quand aucune tâche ne correspond au filtre
    const emptyMessage = {
        all: "Commence par créer ta première tâche.",
        complete: "Aucune tâche n'est encore complète.",
        incomplete: "Tout est complet, bravo.",
    }[filter];

    return (
        <div className="min-h-screen bg-muted px-4 py-10">
            <div className="mx-auto flex w-full max-w-5xl flex-col divide-y rounded-xl border bg-card shadow-sm">
                <div className="p-6">
                    <TasksHeader total={tasks.length} completed={completed} onAdd={() => openDrawer(null)} headingRef={headingRef} />
                </div>

                <main className="flex flex-col">
                    <h2 className="sr-only">Liste des tâches</h2>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
                        <TaskFilterButtons filter={filter} onFilterChange={setFilter} counts={counts} />
                        <p role="status" className="text-sm text-foreground">
                            {loading ? "Chargement des tâches..." : statusMessage}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-6">
                        {actionError && <p role="alert" className="text-sm text-destructive">Erreur : {actionError}</p>}

                        {loading ? null : error ? (
                            <p role="alert" className="text-sm text-destructive">Erreur : {error}</p>
                        ) : displayedTasks.length > 0 ? (
                            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {displayedTasks.map((task) => (
                                    <li key={task.id}>
                                        <TaskCard task={task} onEdit={openDrawer} onDelete={handleDelete} onRemoveAssignee={handleRemoveAssignee} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
                                <strong className="text-base font-semibold text-foreground">Aucune tâche ici</strong>
                                <span>{emptyMessage}</span>
                                <Button variant="outline" className="cursor-pointer" onClick={() => openDrawer(null)}>Ajouter une tâche</Button>
                            </div>
                        )}
                    </div>

                    <TaskFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} task={editingTask} onSaved={handleSaved} />
                </main>
            </div>
        </div>
    )
}
