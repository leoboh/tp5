export type TaskFilter = "all" | "complete" | "incomplete";

export type TaskFilterButtonsProps = {
    filter: TaskFilter;
    onFilterChange: (filter: TaskFilter) => void;
    counts: Record<TaskFilter, number>;
};
