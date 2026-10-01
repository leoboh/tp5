import { Badge } from "./shadcn/badge";
import { TaskStatusBadgeProps } from "../types/taskStatusBadgeProps";

export default function TaskStatusBadge({ complete }: TaskStatusBadgeProps) {
    return complete
        ? <Badge className="gap-1.5 bg-[#12924b]/10 text-[#12924b] before:size-1.5 before:rounded-full before:bg-current">Complète</Badge>
        : <Badge className="gap-1.5 bg-[#d9000a]/10 text-[#d9000a] before:size-1.5 before:rounded-full before:bg-current">Non complète</Badge>;
}
