import { beforeAll, describe, expect, test } from 'vitest'
import { catchThis } from './index'

describe('catchThis', () => {
    test('[error]: it should return rejected with message', async () => {
        let result = catchThis.auto(Promise.reject('error: this promise is not valid'))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', 'error: this promise is not valid')
    })

    test('[error]: it should no error message', async () => {
        let result = catchThis.auto(new Promise(() => {
            throw Object.prototype
        }))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', 'no error message')
    })

    test('[error]: it should return normal error', async () => {
        let result = catchThis.auto(new Promise(() => {
            undefined.toString()
        }))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', `Cannot read properties of undefined (reading 'toString')`)
    })
    test('[error]: it should should return no error message', async () => {
        let result = catchThis.auto(new Promise(() => {
            throw 0
        }))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', 'no error message')
    })

    test('[error]: it should detect promise', async () => {
        let result = catchThis.auto(new Promise(() => {
            throw {}
        }))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', 'no error message')
    })
    test('[error]: it should return no error message', async () => {
        let result = catchThis.auto(new Promise(() => {
            throw undefined
        }))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', 'no error message')
    })

    test('[error]: it should return normal errors', async () => {
        let result = catchThis.auto(new Promise(() => {
            throw new Error('error thrown within the promise')
        }))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', 'error thrown within the promise')
    })

    test('[success]: it should return result as data', async () => {
        let result = catchThis.auto(Promise.resolve('this promise is valid'))

        expect(typeof result).toBe('object')
        expect(typeof result.then).toBe('function')

        let { data, error } = await result

        expect(data).toBe('this promise is valid')
        expect(error).toBeUndefined
    })

    test('[success]: it should detect sync function', () => {
        let result = catchThis.auto(() => ('this promise is valid'))

        expect(result.then).toBeUndefined

        let { data, error } = result

        expect(data).toBe('this promise is valid')
        expect(error).toBeUndefined
    })

    test('[error]: it should detect sync function', () => {
        let result = catchThis.auto(() => { throw new Error('this function throws error') })

        expect(result.then).toBeUndefined

        let { data, error } = result

        expect(data).toBeUndefined
        expect(error).toHaveProperty('message', 'this function throws error')
    })
})
