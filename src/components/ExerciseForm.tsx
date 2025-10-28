import { useState } from "react";
import type { Exercise } from "../types";

interface Props {
  onAdd: (exercise: Exercise) => void;
}

export function ExerciseForm({ onAdd }: Props) {
  const [exercise, setExercise] = useState<Exercise>({
    name: "",
    muscle: "",
    sets: 0,
    reps: 0,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setExercise((prev) => ({
      ...prev,
      [name]: name === "sets" || name === "reps" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!exercise.name) return;
    onAdd(exercise);
    setExercise({ name: "", muscle: "", sets: 0, reps: 0 });
  }

  return (
    <form onSubmit={handleSubmit} className="exercise-form">
      <input
        type="text"
        name="name"
        placeholder="Nome do exercício"
        value={exercise.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="muscle"
        placeholder="Grupo muscular"
        value={exercise.muscle}
        onChange={handleChange}
      />
      <input
        type="number"
        name="sets"
        placeholder="Séries"
        value={exercise.sets}
        onChange={handleChange}
      />
      <input
        type="number"
        name="reps"
        placeholder="Repetições"
        value={exercise.reps}
        onChange={handleChange}
      />
      <button type="submit">Adicionar exercício</button>
    </form>
  );
}
