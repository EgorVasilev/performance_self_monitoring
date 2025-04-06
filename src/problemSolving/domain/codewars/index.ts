import { CodewarsProblem, CodewarsProblemDifficulty } from '../problem';
import { CODEWARS_INVALID_DIFFICULTY } from '../errorCodes';

export const DIFFICULTY_RANGE = [1, 8];

export const NULL_ID = 0;
export const NULL_CODEWARS_PROBLEM: CodewarsProblem = {
    difficulty: 8,
    link: '',
    metricId: 1,
    name: '',
    platformId: 1,
    postedAt: new Date(),
    state: 'rejected',
    timeSpentToSolve: 0,
    id: NULL_ID,
};

export function validateDifficulty(
    difficulty: number,
): Promise<CodewarsProblemDifficulty> {
    const difficultyValue = Math.abs(difficulty); // Codewars service provides difficulty as negative value
    const [min, max] = DIFFICULTY_RANGE;

    if (difficultyValue >= min && difficultyValue <= max)
        return Promise.resolve(difficulty as CodewarsProblemDifficulty);

    return Promise.reject(CODEWARS_INVALID_DIFFICULTY);
}
