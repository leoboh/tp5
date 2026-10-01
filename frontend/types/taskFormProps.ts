import { RefObject } from "react";
import { Task } from "./tasks";

// Props du formulaire d'ajout / modification d'une tâche
export type TaskFormProps = {
    // Tâche à modifier ; null = création
    task: Task | null;
    // Appelée avec la tâche enregistrée renvoyée par l'API
    onSaved: (task: Task) => void;
    // Appelée au clic sur le bouton d'annulation
    onCancel: () => void;
    // Ref du champ "Nom", utilisée par le drawer pour y placer le focus à l'ouverture
    nameInputRef?: RefObject<HTMLInputElement | null>;
};
