import { Task } from "./tasks";

// Props de la carte affichant une tâche
export type TaskCardProps = {
    // Tâche affichée dans la carte
    task: Task;
    // Appelée au clic sur le bouton crayon pour ouvrir la modification
    onEdit: (task: Task) => void;
    // Appelée après confirmation de la suppression
    onDelete: (task: Task) => void;
    // Appelée au clic sur "Retirer le bénévole" ; asynchrone pour replacer le focus une fois terminé
    onRemoveAssignee: (task: Task) => Promise<void>;
};
