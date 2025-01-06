/**
 * Wrapper allows to "intercept" result of a stage within a workflow pipeline
 * @param task - function to wrap
 * @param onError
 * @param onComplete
 */
export function task<T extends Array<unknown>, U>(task: (...args: T) => Promise<U>, onError: (code: number) => void, onComplete: (result: U) => U) {
    return (...args: T): Promise<U> => task(...args).then((result) => {
        onComplete(result);

        return result;
    })
}