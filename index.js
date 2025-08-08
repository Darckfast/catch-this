function normalizeError(err) {
    if (!(err instanceof Error)) {
        if (err instanceof Object) {
            err = JSON.stringify(err)
        }

        err = new Error(err || 'no error message')
    }

    return err
}

class catchThis {
    static auto(fn) {
        if (typeof fn === 'object' && typeof fn.then === 'function') {
            return catchThis.async(fn)
        }

        return catchThis.sync(fn)
    }

    static async async(fn) {
        try {
            const data = await fn;
            return { data, error: undefined };
        } catch (err) {
            return { data: undefined, error: normalizeError(err) };
        }
    }

    static sync(fn) {
        try {
            const data = fn();
            return { data, error: undefined };
        } catch (err) {
            return { data: undefined, error: normalizeError(err) };
        }
    }
}

module.exports = { catchThis }
