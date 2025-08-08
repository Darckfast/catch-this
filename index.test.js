import { describe, expect, test } from 'vitest'
import { catchThis } from './index'

describe('catchThis', () => {
    describe('[async]', () => {
        test('[error]: it should return rejected as normalized error', async () => {
            let result = catchThis.auto(Promise.reject('error: this promise is not valid'))

            expect(typeof result).toBe('object')
            expect(typeof result.then).toBe('function')

            let { data, error } = await result

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', 'error: this promise is not valid')
        })
        test('[error]: it should return error', async () => {
            let { data, error } = await catchThis.auto(new Promise(() => {
                undefined.toString()
            }))

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', `Cannot read properties of undefined (reading 'toString')`)
        })
        test('[error]: it should return a normilized error with "no error message"', async () => {
            let { error, data } = await catchThis.auto(new Promise(() => {
                throw 0
            }))

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', 'no error message')
        })

        test('[error]: it should return error as json string', async () => {
            let { error, data } = await catchThis.auto(new Promise(() => {
                throw {}
            }))

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', '{}')
        })

        test('[error]: it should return error as json string', async () => {
            let { data, error } = await catchThis.auto(new Promise(() => {
                throw { err: 'some error message' }
            }))

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', `{"err":"some error message"}`)
        })
        test('[error]: it should return no error message', async () => {
            let { error, data } = await catchThis.auto(new Promise(() => {
                throw undefined
            }))

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', 'no error message')
        })

        test('[error]: it should return normal errors', async () => {
            let { data, error } = await catchThis.auto(new Promise(() => {
                throw new Error('error thrown within the promise')
            }))

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', 'error thrown within the promise')
        })

        test('[success]: it should return result as data', async () => {
            let { data, error } = await catchThis.auto(Promise.resolve('this promise is valid'))

            expect(data).toBe('this promise is valid')
            expect(error).toBeUndefined
        })
    })

    describe('[sync]', () => {
        test('[success]: it should detect sync function', () => {
            let { data, error } = catchThis.auto(() => ('this promise is valid'))

            expect(data).toBe('this promise is valid')
            expect(error).toBeUndefined
        })

        test('[error]: it should detect sync function', () => {
            let { data, error } = catchThis.auto(() => { throw new Error('this function throws error') })

            expect(data).toBeUndefined
            expect(error).toHaveProperty('message', 'this function throws error')
        })
    })
})
