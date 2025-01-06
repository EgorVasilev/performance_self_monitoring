import {GetUserQuery} from "../../../actors/user/port/in/query/query";
import {GetSettingsQuery} from "../../../settings/port/in/query/getSettings";
import {UserId} from "../../../actors/user/domain/user";
import {Settings} from "../../../settings/domain/settings";
import {ProblemSolvingProfiles} from "../../../problemSolving/domain/profile";
import {PerformanceMetric} from "../../../settings/domain/metrics";

export type ReadUserPerformanceSummaryWorkflow = (getUser: GetUserQuery, getSettings: GetSettingsQuery, userId: UserId, onNoUserError: () => void) => Promise<(ProblemSolvingProfiles)[]>

export type MapPerformanceSummaryList = (metrics: PerformanceMetric[], userId: UserId) => Promise<(ProblemSolvingProfiles)[]> // TODO Bad signature, userId must be removed as well as Promise