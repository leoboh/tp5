import { RefObject } from "react";

// Props de l'en-tête de la liste (titre, progression, bouton d'ajout)
export type TasksHeaderProps = {
    // Nombre total de tâches
    total: number;
    // Nombre de tâches complètes
    completed: number;
    // Appelée au clic sur le bouton d'ajout d'une tâche
    onAdd: () => void;
    // Ref du <h1>, utilisée pour y replacer le focus quand l'élément focalisé disparaît
    headingRef?: RefObject<HTMLHeadingElement | null>;
};
