import { CreateCodewarsProblem } from '../../../port/in/command';
import { CodewarsRepository } from '../../../port/out/problemSolvingRepository';
import { CodewarsPlatformApi } from '../../../port/out/codewarsPlatformApi';
import { CodewarsProblem, isNullProblem } from '../../../domain/problem';
import { validateDifficulty } from '../../../domain/codewars';
import {
    CODEWARS_PROBLEM_ALREADY_EXISTS,
    CODEWARS_PROBLEM_SERVICE_UNAVAILABLE,
} from '../../../domain/errorCodes';

export const createCodewarsProblem =
    (
        repository: CodewarsRepository,
        codewarsPlatformApi: CodewarsPlatformApi,
    ): CreateCodewarsProblem =>
    ({ link, comment }) => {
        return new Promise<CodewarsProblem>(async (resolve, reject) => {
            try {
                const maybeExistingProblem =
                    await repository.getProblemByLink(link);

                if (!isNullProblem(maybeExistingProblem))
                    reject(CODEWARS_PROBLEM_ALREADY_EXISTS);

                const problemDetails = await codewarsPlatformApi
                    .getKataDetails(link)
                    .catch(() => {
                        throw CODEWARS_PROBLEM_SERVICE_UNAVAILABLE;
                    });

                const difficulty = await validateDifficulty(
                    problemDetails.difficulty,
                );

                resolve({
                    id: 1,
                    state: 'pending',
                    difficulty,
                    link,
                    postedAt: new Date(Date.now()),
                    metricId: 1,
                    comment,
                    platformId: 1,
                    timeSpentToSolve: 0,
                    name: 'Special Multiples',
                });
            } catch (e) {
                reject(e);
            }
        });
    };
