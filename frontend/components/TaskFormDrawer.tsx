import { useRef } from "react";
import { TaskFormDrawerProps } from "../types/taskFormDrawerProps";
import TaskForm from "./TaskForm.tsx";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "./shadcn/drawer";

export default function TaskFormDrawer({ open, onOpenChange, task, onSaved }: TaskFormDrawerProps) {
    // Le drawer (Base UI) gère le focus : on lui indique de cibler le champ "Nom" à l'ouverture
    const nameInputRef = useRef<HTMLInputElement>(null);

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent initialFocus={nameInputRef}>
                <DrawerHeader>
                    <DrawerTitle>{task ? "Modifier la tâche" : "Nouvelle tâche"}</DrawerTitle>
                    <DrawerDescription>
                        {task ? `Tâche #${task.id}` : "Renseigne le nom et la description de la tâche."}
                    </DrawerDescription>
                </DrawerHeader>
                <TaskForm
                    key={task?.id ?? "new"}
                    task={task}
                    onSaved={onSaved}
                    onCancel={() => onOpenChange(false)}
                    nameInputRef={nameInputRef}
                />
            </DrawerContent>
        </Drawer>
    )
}
