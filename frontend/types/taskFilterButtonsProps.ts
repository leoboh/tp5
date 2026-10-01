// Filtres possibles : toutes les tâches, complètes ou non complètes
export type TaskFilter = "all" | "complete" | "incomplete";

// Props du groupe de boutons de filtre
export type TaskFilterButtonsProps = {
    // Filtre actuellement sélectionné
    filter: TaskFilter;
    // Appelée au clic sur un bouton de filtre
    onFilterChange: (filter: TaskFilter) => void;
    // Nombre de tâches pour chaque filtre, affiché sur les boutons
    counts: Record<TaskFilter, number>;
};
