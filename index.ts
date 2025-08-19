type Result<T> = TError | TSuccess<T>

type TError = {
    data: undefined
    error: Error
}
type TSuccess<T> = {
    data: T
    error: undefined
}

function normalizeError(err: any): Error {
    if (!(err instanceof Error)) {
        if (err instanceof Object) {
            err = JSON.stringify(err)
        }

        err = new Error(err || 'no error message')
    }

    return err
}

class catchThis {
    static auto<T>(fn: () => T | Promise<T>): Promise<Result<T>> | Result<T> {
        if (fn instanceof Promise) {
            return catchThis.async(fn as Promise<T>) as Promise<Result<T>>
        }

        return catchThis.sync(fn as () => T) as Result<T>
    }

    static async async<T>(fn: Promise<T>): Promise<Result<T>> {
        try {
            const data = await fn;
            return { data, error: undefined };
        } catch (err) {
            return { data: undefined, error: normalizeError(err) };
        }
    }

    static sync<T>(fn: () => T): Result<T> {
        try {
            const data = fn();
            return { data, error: undefined };
        } catch (err) {
            return { data: undefined, error: normalizeError(err) };
        }
    }
}

export {
    catchThis
}

