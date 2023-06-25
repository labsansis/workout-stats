export class Exercise {
  name: string;
  category: string;
  displayName: string;
}

export enum WeightUnit {
  KG = "kg",
  LBS = "lbs",
}

export class ExerciseSet {
  exercise: Exercise;
  repetitionCount: number;
  weight?: number;
  weightUnit: WeightUnit;
  startTime: Date;
  duration: number;
}

export class Workout {
  sourceWorkoutId: string;
  name: string;
  startTime: Date;
  duration: number;
  workoutType: string;
  exerciseSets?: ExerciseSet[];
}
