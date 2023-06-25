export class GarminExercise {
    name: string;
    category: string;
    probability: number;
}

export class GarminExerciseSet {
    exercises: GarminExercise[];
    repetitionCount: number;
    weight?: number;
    // string ISO GMT by the looks of it
    startTime: string;
    duration: number;
    setType: string;
}

export class GarminActivity {
    activityId: number;
    activityName: string;
    activityType: {typeId: number, typeKey: string};
    duration: number;
    startTimeGMT: string;
    beginTimestamp: number;
    fullExerciseSets?: GarminExerciseSet[];
}
