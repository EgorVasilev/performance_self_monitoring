export type ProblemId = number

type CommonProblem = {
    readonly id: ProblemId;
    readonly timeSpentToSolve: number; // seconds
    readonly postedAt: Date;
    readonly link: string;
    comment: string;
    metricId: 1;
}

type AbandonedProblem = CommonProblem & {
    state: 'abandoned'
}

type SolvedProblem = CommonProblem & {
    state: 'solved'
}

type CodewarsProblem = (AbandonedProblem | SolvedProblem) & {
    readonly platformId: 1;
    readonly difficulty: number;
}

export type Problem = CodewarsProblem




