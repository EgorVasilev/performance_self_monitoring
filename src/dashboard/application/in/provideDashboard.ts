import { getUser } from '../../../actors/user/adapter/in/core/query/query';
import { getSettings } from '../../../settings/adapters/in/query/getSettings';
import { GetUserQuery } from '../../../actors/user/port/in/query/query';
import { GetSettingsQuery } from '../../../settings/port/in/query/getSettings';
import { UserId } from '../../domain/user';
import { task } from '../../../shared/utils/task';
import {
    MapPerformanceSummaryList,
    ReadUserPerformanceSummaryWorkflow,
} from '../../port/in/provideDashboard';
import { USER_NOT_FOUND } from '../../../actors/user/domain/errors';
import { getAllProblemSolvingProfiles } from '../../../problemSolving/adapter/in/core/query';
import { ProblemSolvingProfiles } from '../../../problemSolving/domain/profile';

const getUserQuery = getUser({
    getUser: (userId) =>
        new Promise((resolve, reject) => {
            setTimeout(
                () =>
                    userId === 1
                        ? resolve({ id: userId, settingId: userId })
                        : reject(404),
                1000,
            );
        }),
});

const getSettingsQuery = getSettings({
    getSettings: (userId) =>
        new Promise((resolve) => {
            setTimeout(
                () =>
                    resolve({
                        id: userId,
                        enabledMetrics: [{ type: 'problemSolving', id: 1 }],
                        usersAllowedToSeeMetrics: [],
                        usersDeniedToSeeMetrics: [],
                        layout: {
                            rows: [
                                { contentId: 1 },
                                { contentId: 1 },
                                { contentId: 1 },
                            ],
                        },
                    }),
                1000,
            );
        }),
});

async function readUserPerformanceSummaryController(id: UserId) {
    const getUserTask = task(
        getUserQuery,
        (error) => {
            console.log('user is undefined, do redirect', error);
        },
        (result) => {
            console.log('render header 1', result);
            return result;
        },
    );

    const getSettingsTask = task(
        getSettingsQuery,
        (error) => {
            console.log('error', error);
        },
        (result) => {
            console.log('render layout 2', result);
            return result;
        },
    );

    readUserPerformanceSummary(getUserTask, getSettingsTask, id, () => {
        console.log('Go to 404');
    });
}

const readUserPerformanceSummary: ReadUserPerformanceSummaryWorkflow = async (
    getUser: GetUserQuery,
    getSettings: GetSettingsQuery,
    userId: number,
    onNoUserError: (code: number) => void,
) => {
    try {
        const user = await getUser(userId);

        const settings = await getSettings(user.settingId);

        settings.enabledMetrics.map((metric) => {
            console.log('fetch metric', metric.id, metric.type);
        });

        return mapMetricsList(settings.enabledMetrics, userId);
    } catch (e) {
        if (e === USER_NOT_FOUND) {
            onNoUserError(e);
        }

        return [];
    }
};

const metricsMap = {
    problemSolving: getAllProblemSolvingProfiles({
        get: () =>
            new Promise<ProblemSolvingProfiles>((resolve) =>
                resolve([
                    {
                        overallTimeSpent: 0,
                        rank: 0,
                        honor: 0,
                        leaderboardPosition: 0,
                    },
                ]),
            ),
    }),
} as const;

const mapMetricsList: MapPerformanceSummaryList = async (
    metrics,
    userId: UserId,
) => {
    const map = await Promise.all(
        metrics.map(async (metric) => {
            return metricsMap[metric.type](userId);
        }),
    );

    return map;
};

console.log(readUserPerformanceSummaryController(2));
