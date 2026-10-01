// Tâche telle que renvoyée par l'API
export type Task = {
    // Identifiant unique de la tâche
    id: string;
    // Nom de la tâche (obligatoire)
    name: string;
    // Description de la tâche, null si non renseignée
    description: string | null;
    // Bénévole assigné à la tâche, null si personne
    assignee: string | null;
    // Calculé en base : true quand le nom et la description sont renseignés
    complete: boolean;
}
