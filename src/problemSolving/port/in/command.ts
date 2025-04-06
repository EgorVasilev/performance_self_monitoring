import { CodewarsProblem, ProblemLink } from '../../domain/problem';

export type CreateCodewarsProblem = (problemData: {
    link: ProblemLink;
    comment?: string;
}) => Promise<CodewarsProblem>;
