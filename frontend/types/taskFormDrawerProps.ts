import { Task } from "./tasks";

// Props du drawer contenant le formulaire d'ajout / modification
export type TaskFormDrawerProps = {
    // Drawer ouvert ou fermé
    open: boolean;
    // Appelée quand le drawer demande à s'ouvrir ou se fermer
    onOpenChange: (open: boolean) => void;
    // Tâche à modifier ; null = création
    task: Task | null;
    // Appelée avec la tâche enregistrée renvoyée par l'API
    onSaved: (task: Task) => void;
};
