import { UserId } from '../../../actors/user/domain/user';

import { ProblemId, Problem, CodewarsProblem } from '../../domain/problem';
import { CodewarsProfile, ProblemSolvingProfiles } from '../../domain/profile';

export type GetCodewarsProblem = (id: ProblemId) => Promise<CodewarsProblem>;
export type GetAllCodewarsProblems = () => Promise<CodewarsProblem[]>;
export type GetCodewarsProfile = (forUser: UserId) => Promise<CodewarsProfile>;

export type GetAllProblemSolvingProfiles = (
    forUser: UserId,
) => Promise<ProblemSolvingProfiles>;
