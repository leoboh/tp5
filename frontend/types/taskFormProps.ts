import { RefObject } from "react";
import { Task } from "./tasks";

export type TaskFormProps = {
    // Tâche à modifier ; null = création
    task: Task | null;
    onSaved: (task: Task) => void;
    onCancel: () => void;
    // Ref du champ "Nom", utilisée par le drawer pour y placer le focus à l'ouverture
    nameInputRef?: RefObject<HTMLInputElement | null>;
};
