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
        }
        catch (err) {
            if (!(err instanceof Error)) {
                err = new Error(err || 'no error message')
            }


            return { data: undefined, error: err };
        }
    }

    static sync(fn) {
        try {
            const data = fn();
            return { data, error: undefined };
        }
        catch (err) {
            if (!(err instanceof Error)) {
                err = new Error(err || 'no error message')
            }

            return { data: undefined, error: err };
        }
    }
}

module.exports = { catchThis }
