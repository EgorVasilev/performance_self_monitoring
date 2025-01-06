import {UserId} from "../../../actors/user/domain/user";

import {ProblemId, Problem} from "../../domain/problem";
import {CodewarsProfile, ProblemSolvingProfiles} from "../../domain/profile";

export type GetProblemQuery = (id: ProblemId)  => Promise<Problem>

export type GetCodewarsProfile = (forUser: UserId) => Promise<CodewarsProfile>

export type GetAllProblemSolvingProfiles = (forUser: UserId) => Promise<ProblemSolvingProfiles>
