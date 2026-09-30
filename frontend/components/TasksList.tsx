import { useEffect, useState } from "react";
import { Task } from "../types/tasks";

export default function TasksList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetch("http://localhost:3000/tasks") // adapte le port de ton back
        .then((res) => {
            if (!res.ok) throw new Error("Erreur lors du chargement");
            return res.json();
        })
        .then((data) => setTasks(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []); // [] = exécuté une seule fois au montage

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <section>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.name}</li>
                ))}
            </ul>
        </section>
    )
}