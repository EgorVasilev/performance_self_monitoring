import { UserId } from '../../../actors/user/domain/user';
import { ProblemSolvingProfiles } from '../../domain/profile';
import { CodewarsProblem, ProblemId, ProblemLink } from '../../domain/problem';
import { NULL_CODEWARS_PROBLEM } from '../../domain/codewars';

export interface GetAllProblemSolvingProfilesRepository {
    get: (forUser: UserId) => Promise<ProblemSolvingProfiles>;
}

export interface CodewarsRepository {
    getProblem: (id: ProblemId) => Promise<CodewarsProblem>;
    getProblemByLink: (
        link: ProblemLink,
    ) => Promise<CodewarsProblem | typeof NULL_CODEWARS_PROBLEM>;
    getProblemsList: () => Promise<CodewarsProblem[]>;
    createProblem: (problem: CodewarsProblem) => Promise<null>;
}
