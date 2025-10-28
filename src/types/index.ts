export interface Exercise {
  name: string;
  muscle: string;
  sets: number;
  reps: number;
}

export interface Workout {
  id: number;
  day: string;
  exercises: Exercise[];
}
