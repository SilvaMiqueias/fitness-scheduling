export interface Exercise {
  id: string;
  name: string;
  force: string; // "pull", "push", etc.
  level: string; // "iniciante", "intermediario", etc.
  mechanic: string; // "composto", "isolado", etc.
  equipment: string; // "halteres", "barra", etc.
  primaryMuscles: string[]; // array de músculos primários
  secondaryMuscles: string[]; // array de músculos secundários
  instructions: string[]; // array de instruções passo a passo
  category: string; // "forca", etc.
  images: string[]; // caminhos das imagens
}

export async function fetchExercises(muscle: string): Promise<Exercise[]> {
  const res = await fetch("/exercises-ptbr.json");
  if (!res.ok) throw new Error("Erro ao carregar lista de exercícios");

  const data: Exercise[] = await res.json();

  return data.filter((ex) => {
    const primaryMatch = ex.primaryMuscles?.some(
      (m) => m.toLowerCase() === muscle.toLowerCase()
    );

    const secondaryMatch = ex.secondaryMuscles?.some(
      (m) => m.toLowerCase() === muscle.toLowerCase()
    );

    return primaryMatch || secondaryMatch;
  });
}

