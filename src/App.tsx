import { useState, useEffect } from "react";
import { fetchExercises, Exercise } from "./service/exercisesService";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

export default function App() {
  const [muscle, setMuscle] = useState(""); // inicialmente vazio
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useLocalStorage<WorkoutDay[]>("workouts", []);
  const [cache, setCache] = useLocalStorage<Record<string, Exercise[]>>(
    "exercises_cache",
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [musclesList, setMusclesList] = useState<string[]>([]); // lista de músculos primários

  // Carrega exercícios e extrai músculos únicos para o select
  useEffect(() => {
    async function loadAllExercises() {
      try {
        setLoading(true);
        const data = await fetch("/exercises-ptbr.json").then((res) => res.json() as Promise<Exercise[]>);

        // extrai todos os músculos primários únicos
        const uniqueMuscles = Array.from(
          new Set(data.flatMap((ex) => ex.primaryMuscles))
        );
        setMusclesList(uniqueMuscles);

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    loadAllExercises();
  }, []);

  // Carrega exercícios filtrados pelo músculo selecionado
  useEffect(() => {
    if (!muscle) return; // não faz nada se nenhum músculo selecionado

    async function loadExercises() {
      if (cache[muscle]) {
        setExercises(cache[muscle]);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchExercises(muscle);
        setExercises(data);
        setCache({ ...cache, [muscle]: data });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, [muscle]);

  function toggleExercise(ex: Exercise) {
    if (selectedExercises.some((e) => e.name === ex.name)) {
      setSelectedExercises(selectedExercises.filter((e) => e.name !== ex.name));
    } else {
      setSelectedExercises([...selectedExercises, ex]);
    }
  }

  function saveWorkout(day: string) {
    const updated = [
      ...workouts.filter((w) => w.day !== day),
      { day, exercises: selectedExercises },
    ];
    setWorkouts(updated);
    toast.success(`Treino de ${day} salvo com sucesso! 💪`);
  }

  return (
    <div className="conteiner-fluid" style={{ padding: 20 }}>
      <ToastContainer />

      <h1 className="text-center">🏋️ Meu Treininho</h1>

      {/* Select dinâmico de músculos primários */}
      <select
        value={muscle}
        onChange={(e) => setMuscle(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <option value="">Selecione um músculo</option>
        {musclesList.map((m) => (
          <option key={m} value={m}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </option>
        ))}
      </select>

      {loading && <p>Carregando exercícios...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {exercises.length > 10 ?  <h3 >Exercicios</h3> : null} 
      <div className={exercises.length > 10 ? 'content' : ''}>
        <ul>
                {exercises.map((ex) => (
                  <li key={ex.name}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedExercises.some((e) => e.name === ex.name)}
                        onChange={() => toggleExercise(ex)}
                      />
                      <strong> {ex.name}</strong> — {ex.category} ({ex.equipment})
                      <br />
                    </label>
                  </li>
                ))}
        </ul>
      </div>
    
      <h3 className="mt-5">Salvar treino</h3>
      <select
        onChange={(e) => saveWorkout(e.target.value)}
        defaultValue=""
        style={{ marginBottom: 20 }}
      >
        <option value="" disabled>
          Escolha o dia
        </option>
        <option value="Segunda">Segunda</option>
        <option value="Terça">Terça</option>
        <option value="Quarta">Quarta</option>
        <option value="Quinta">Quinta</option>
        <option value="Sexta">Sexta</option>
      </select>

      <h2>📅 Treinos salvos</h2>
      {workouts.map((w) => (
        <div key={w.day}>
          <h3>{w.day}</h3>
          <div>
                <ul>
                  {w.exercises.map((ex) => (
                    <li key={ex.name}>{ex.name}</li>
                  ))}
                </ul>
          </div>
      
        </div>
      ))}
    </div>
  );
}
