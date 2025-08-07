class catchThis {
    static auto(fn) {
        if (typeof fn === 'object' && typeof fn.then === 'function') {
            return catchThis.async(fn)
        }

        return catchThis.sync(fn)
    }

    static async async(promise) {
        try {
            const data = await promise;
            return { data, error: undefined };
        }
        catch (error) {
            if (typeof error === 'string') {
                error = { message: error }
            }

            if (!error || !error.message) {
                error = { message: 'no error message' }
            }

            return { data: undefined, error: error };
        }
    }

    static sync(callback) {
        try {
            const data = callback();
            return { data, error: undefined };
        }
        catch (error) {
            if (typeof error === 'string') {
                error = { message: error }
            }

            if (!error || !error.message) {
                error = { message: 'no error message' }
            }

            return { data: undefined, error: error };
        }
    }
}

module.exports = { catchThis }
