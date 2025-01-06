import {UserId} from "../../../actors/user/domain/user";
import {ProblemSolvingProfiles} from "../../domain/profile";

export interface GetAllProblemSolvingProfilesRepository  {
    get: (forUser: UserId) => Promise<ProblemSolvingProfiles>
}