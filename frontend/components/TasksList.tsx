import { useEffect, useRef, useState } from "react";
import { Task } from "../types/tasks";
import { TaskFilter } from "../types/taskFilterButtonsProps";
import TasksHeader from "./TasksHeader.tsx";
import TaskFilterButtons from "./TaskFilterButtons.tsx";
import TaskCard from "./TaskCard.tsx";
import TaskFormDrawer from "./TaskFormDrawer.tsx";
import { Button } from "./shadcn/button";

export default function TasksList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Messages annoncés aux lecteurs d'écran : succès (role="status") et erreurs d'action (role="alert")
    const [statusMessage, setStatusMessage] = useState("");
    const [actionError, setActionError] = useState<string | null>(null);

    // Cible du focus quand la carte focalisée est supprimée
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Filtre d'affichage des tâches
    const [filter, setFilter] = useState<TaskFilter>("all");

    // Drawer d'ajout / modification (editingTask null = ajout)
    const [drawerOpen, setDrawerOpen] = useState(false);
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

    const openDrawer = (task: Task | null) => {
        setEditingTask(task);
        setDrawerOpen(true);
    };

    const handleSaved = (saved: Task) => {
        setTasks(editingTask
            ? tasks.map((t) => (t.id === saved.id ? saved : t))
            : [...tasks, saved]);
        setActionError(null);
        setStatusMessage(`Dernière action : « ${saved.name} » ${editingTask ? "modifiée" : "ajoutée"}.`);
        setDrawerOpen(false);
    };

    const handleDelete = async (task: Task) => {
        try {
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

    const completed = tasks.filter((t) => t.complete).length;
    const counts = { all: tasks.length, complete: completed, incomplete: tasks.length - completed };

    const displayedTasks = tasks.filter((t) => {
        if (filter === "complete") return t.complete;
        if (filter === "incomplete") return !t.complete;
        return true;
    });

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
                                        <TaskCard task={task} onEdit={openDrawer} onDelete={handleDelete} />
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
