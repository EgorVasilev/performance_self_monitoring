export type ProblemId = number;

export type ProblemLink = string;

type CommonProblem = {
    comment?: string;
    id: ProblemId;
    link: ProblemLink;
    metricId: 1;
    name: string;
    postedAt: Date;
    state: 'rejected' | 'pending' | 'solved';
    timeSpentToSolve: number; // seconds
};

export type CodewarsProblemDifficulty = 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

export type CodewarsProblem = CommonProblem & {
    readonly platformId: 1;
    readonly difficulty: CodewarsProblemDifficulty;
};

export type Problem = CodewarsProblem;

export const NULL_ID = 0;

export function isNullProblem(problem: CommonProblem) {
    return problem.id === NULL_ID;
}
