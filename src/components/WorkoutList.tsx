import type { Workout } from "../types";

interface Props {
  workouts: Workout[];
  onDelete: (id: number) => void;
}

export function WorkoutList({ workouts, onDelete }: Props) {
  if (workouts.length === 0) {
    return <p>Nenhum treino cadastrado ainda.</p>;
  }

  return (
    <div>
      {workouts.map((w) => (
        <div key={w.id} className="workout-card">
          <h3>{w.day}</h3>
          <ul>
            {w.exercises.map((ex, i) => (
              <li key={i}>
                {ex.name} — {ex.muscle} ({ex.sets}x{ex.reps})
              </li>
            ))}
          </ul>
          <button onClick={() => onDelete(w.id)}>Excluir treino</button>
        </div>
      ))}
    </div>
  );
}
