import { RefObject } from "react";

export type TasksHeaderProps = {
    total: number;
    completed: number;
    onAdd: () => void;
    // Ref du <h1>, utilisée pour y replacer le focus quand l'élément focalisé disparaît
    headingRef?: RefObject<HTMLHeadingElement | null>;
};
