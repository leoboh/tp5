export type Task = {
    id: string;
    name: string;
    description: string | null;
    assignee: string | null;
    complete: boolean;
}
