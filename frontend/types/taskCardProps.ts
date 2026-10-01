import { Task } from "./tasks";

export type TaskCardProps = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onRemoveAssignee: (task: Task) => Promise<void>;
};
