import { Badge } from "./shadcn/badge";
import { TaskStatusBadgeProps } from "../types/taskStatusBadgeProps";

export default function TaskStatusBadge({ complete }: TaskStatusBadgeProps) {
    return complete
        ? <Badge className="gap-1.5 bg-[#0a6e38]/10 text-[#0a6e38] before:size-1.5 before:rounded-full before:bg-current">Complète</Badge>
        : <Badge className="gap-1.5 bg-[#c0000a]/10 text-[#c0000a] before:size-1.5 before:rounded-full before:bg-current">Non complète</Badge>;
}
