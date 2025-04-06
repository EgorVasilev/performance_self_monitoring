import { GetAllProblemSolvingProfilesRepository } from '../../../port/out/problemSolvingRepository';
import { GetAllProblemSolvingProfiles } from '../../../port/in/query';

export const getAllProblemSolvingProfiles =
    (
        repository: GetAllProblemSolvingProfilesRepository,
    ): GetAllProblemSolvingProfiles =>
    (forUser) =>
        repository.get(forUser);
