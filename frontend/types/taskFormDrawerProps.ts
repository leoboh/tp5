import { Task } from "./tasks";

export type TaskFormDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Tâche à modifier ; null = création
    task: Task | null;
    onSaved: (task: Task) => void;
};
