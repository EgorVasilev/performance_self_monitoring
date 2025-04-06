import { it, describe, before, mock } from 'node:test';
import assert from 'node:assert';

import { createCodewarsProblem } from './command';
import { CodewarsRepository } from '../../../port/out/problemSolvingRepository';
import { CodewarsProblem } from '../../../domain/problem';
import { CodewarsPlatformApi } from '../../../port/out/codewarsPlatformApi';
import {
    CODEWARS_INVALID_DIFFICULTY,
    CODEWARS_PROBLEM_ALREADY_EXISTS,
    CODEWARS_PROBLEM_SERVICE_UNAVAILABLE,
} from '../../../domain/errorCodes';
import {
    DIFFICULTY_RANGE,
    NULL_CODEWARS_PROBLEM,
} from '../../../domain/codewars';

const codewarsPlatformApiMock: CodewarsPlatformApi = {
    getKataDetails: (kataUrl) => {
        const problems = new Map([
            [
                'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
                {
                    difficulty: 6,
                },
            ],
            [
                'https://www.codewars.com/kata/583710ccaa6717322c000105',
                {
                    difficulty: 8,
                },
            ],
        ]);

        return new Promise<{ difficulty: number }>((resolve, reject) => {
            const problem = problems.get(kataUrl);

            if (problem) resolve(problem);

            reject();
        });
    },
};

describe('codewars commands', (context) => {
    describe('create problem', () => {
        mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 1000 });

        const problemMock: CodewarsProblem = {
            id: 1,
            state: 'pending',
            difficulty: 2,
            link: 'https://www.codewars.com/kata/53c945d750fe7094ee00016b',
            postedAt: new Date('22-02-2025'),
            metricId: 1,
            comment: '',
            platformId: 1,
            timeSpentToSolve: 100,
            name: 'Mock The Task',
        };

        const repositoryMock: CodewarsRepository = {
            getProblem: () => Promise.resolve(problemMock),
            getProblemByLink: (link) =>
                new Promise((resolve, reject) => {
                    resolve(
                        link === problemMock.link
                            ? problemMock
                            : NULL_CODEWARS_PROBLEM,
                    );
                }),
            getProblemsList: () => Promise.resolve([]),
            createProblem: () => Promise.resolve(null),
        };

        it('successfully creates a problem', async () => {
            const execCreation = createCodewarsProblem(
                repositoryMock,
                codewarsPlatformApiMock,
            );
            const newProblemDto = {
                link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
            };

            const { id, ...newProblem } = await execCreation(newProblemDto);

            assert.deepStrictEqual(newProblem, {
                state: 'pending',
                difficulty: 6,
                link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
                postedAt: new Date(Date.now()),
                metricId: 1,
                comment: undefined,
                platformId: 1,
                timeSpentToSolve: 0,
                name: 'Special Multiples',
            });
        });

        it('uses Codewars API to define a problem details such as difficulty', async () => {
            const execCreation = createCodewarsProblem(
                repositoryMock,
                codewarsPlatformApiMock,
            );
            const newProblemA = await execCreation({
                link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
            });

            assert.deepStrictEqual(newProblemA, {
                id: 1,
                state: 'pending',
                difficulty: 6,
                link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
                postedAt: new Date(Date.now()),
                metricId: 1,
                comment: undefined,
                platformId: 1,
                timeSpentToSolve: 0,
                name: 'Special Multiples',
            });

            const newProblemB = await execCreation({
                link: 'https://www.codewars.com/kata/583710ccaa6717322c000105',
            });

            assert.deepStrictEqual(newProblemB, {
                id: 1,
                state: 'pending',
                difficulty: 8,
                link: 'https://www.codewars.com/kata/583710ccaa6717322c000105',
                postedAt: new Date(Date.now()),
                metricId: 1,
                comment: undefined,
                platformId: 1,
                timeSpentToSolve: 0,
                name: 'Special Multiples',
            });
        });

        it('records a passed comment', async () => {
            const execCreation = createCodewarsProblem(
                repositoryMock,
                codewarsPlatformApiMock,
            );
            const newProblem = await execCreation({
                link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
                comment: 'hello world',
            });

            assert.equal(newProblem.comment, 'hello world');
        });

        describe('exceptions', () => {
            it('rejects when codewarsPlatformApi is unavailable', () => {
                const codewarsPlatformApiMock: CodewarsPlatformApi = {
                    getKataDetails: () =>
                        new Promise((resolve, reject) => reject(500)),
                };

                const execCreation = createCodewarsProblem(
                    repositoryMock,
                    codewarsPlatformApiMock,
                );

                assert.rejects(
                    execCreation({
                        link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
                        comment: 'hello world',
                    }),
                    (err) => {
                        assert.strictEqual(
                            err,
                            CODEWARS_PROBLEM_SERVICE_UNAVAILABLE,
                        );
                        return true;
                    },
                );
            });

            describe('difficulty definition', () => {
                it('rejects when difficulty is above known difficulty (abs)', () => {
                    const [_, max] = DIFFICULTY_RANGE;
                    const codewarsPlatformApiMock: CodewarsPlatformApi = {
                        getKataDetails: () =>
                            new Promise((resolve) =>
                                resolve({ difficulty: max + 1 }),
                            ),
                    };

                    const execCreation = createCodewarsProblem(
                        repositoryMock,
                        codewarsPlatformApiMock,
                    );

                    assert.rejects(
                        execCreation({
                            link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
                            comment: 'hello world',
                        }),
                        (err) => {
                            assert.strictEqual(
                                err,
                                CODEWARS_INVALID_DIFFICULTY,
                            );
                            return true;
                        },
                    );
                });

                it('rejects when difficulty is zero', () => {
                    const [min] = DIFFICULTY_RANGE;
                    const codewarsPlatformApiMock: CodewarsPlatformApi = {
                        getKataDetails: () =>
                            new Promise((resolve) =>
                                resolve({ difficulty: min - 1 }),
                            ),
                    };

                    const execCreation = createCodewarsProblem(
                        repositoryMock,
                        codewarsPlatformApiMock,
                    );

                    assert.rejects(
                        execCreation({
                            link: 'https://www.codewars.com/kata/55e785dfcb59864f200000d9',
                            comment: 'hello world',
                        }),
                        (err) => {
                            assert.strictEqual(
                                err,
                                CODEWARS_INVALID_DIFFICULTY,
                            );
                            return true;
                        },
                    );
                });
            });

            it('rejects if the problem already exists', () => {
                const alreadyExistedProblem = problemMock;
                const execCreation = createCodewarsProblem(
                    {
                        ...repositoryMock,
                        getProblemByLink: () =>
                            Promise.resolve(alreadyExistedProblem),
                    },
                    codewarsPlatformApiMock,
                );

                assert.rejects(
                    execCreation({
                        link: alreadyExistedProblem.link,
                        comment: 'hello world',
                    }),
                    (err) => {
                        assert.strictEqual(
                            err,
                            CODEWARS_PROBLEM_ALREADY_EXISTS,
                        );
                        return true;
                    },
                );
            });
        });
    });
});
