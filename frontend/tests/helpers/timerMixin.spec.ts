import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useTimerMixin from '../../src/helpers/timerMixin'

describe('timerMixin', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	describe('timer function', () => {
		it('should call callback immediately with true', () => {
			const { timer } = useTimerMixin()
			const callback = vi.fn()

			timer(callback, 1000)

			expect(callback).toHaveBeenCalledWith(true)
			expect(callback).toHaveBeenCalledTimes(1)
		})

		it('should call callback with false after specified time', () => {
			const { timer } = useTimerMixin()
			const callback = vi.fn()

			timer(callback, 1000)

			expect(callback).toHaveBeenCalledWith(true)

			vi.advanceTimersByTime(1000)

			expect(callback).toHaveBeenCalledWith(false)
			expect(callback).toHaveBeenCalledTimes(2)
		})

		it('should respect different timeout durations', () => {
			const { timer } = useTimerMixin()
			const callback = vi.fn()

			timer(callback, 3000)

			expect(callback).toHaveBeenCalledWith(true)

			vi.advanceTimersByTime(2000)
			expect(callback).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(1000)
			expect(callback).toHaveBeenCalledWith(false)
			expect(callback).toHaveBeenCalledTimes(2)
		})

		it('should handle multiple timers independently', () => {
			const { timer } = useTimerMixin()
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			timer(callback1, 1000)
			timer(callback2, 2000)

			expect(callback1).toHaveBeenCalledWith(true)
			expect(callback2).toHaveBeenCalledWith(true)

			vi.advanceTimersByTime(1000)

			expect(callback1).toHaveBeenCalledWith(false)
			expect(callback1).toHaveBeenCalledTimes(2)
			expect(callback2).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(1000)

			expect(callback2).toHaveBeenCalledWith(false)
			expect(callback2).toHaveBeenCalledTimes(2)
		})

		it('should handle zero timeout', () => {
			const { timer } = useTimerMixin()
			const callback = vi.fn()

			timer(callback, 0)

			expect(callback).toHaveBeenCalledWith(true)

			vi.advanceTimersByTime(0)

			expect(callback).toHaveBeenCalledWith(false)
			expect(callback).toHaveBeenCalledTimes(2)
		})

		it('should handle very short timeouts', () => {
			const { timer } = useTimerMixin()
			const callback = vi.fn()

			timer(callback, 1)

			expect(callback).toHaveBeenCalledWith(true)

			vi.advanceTimersByTime(1)

			expect(callback).toHaveBeenCalledWith(false)
			expect(callback).toHaveBeenCalledTimes(2)
		})

		it('should handle very long timeouts', () => {
			const { timer } = useTimerMixin()
			const callback = vi.fn()

			timer(callback, 60000)

			expect(callback).toHaveBeenCalledWith(true)

			vi.advanceTimersByTime(59999)
			expect(callback).toHaveBeenCalledTimes(1)

			vi.advanceTimersByTime(1)
			expect(callback).toHaveBeenCalledWith(false)
			expect(callback).toHaveBeenCalledTimes(2)
		})

		it('should work with arrow function callbacks', () => {
			const { timer } = useTimerMixin()
			const results: boolean[] = []

			timer((value) => {
				results.push(value)
			}, 1000)

			expect(results).toEqual([true])

			vi.advanceTimersByTime(1000)

			expect(results).toEqual([true, false])
		})

		it('should work with callbacks that have side effects', () => {
			const { timer } = useTimerMixin()
			let state = false

			timer((value) => {
				state = value
			}, 1000)

			expect(state).toBe(true)

			vi.advanceTimersByTime(1000)

			expect(state).toBe(false)
		})
	})

	describe('return value', () => {
		it('should return timer function', () => {
			const mixin = useTimerMixin()

			expect(mixin).toHaveProperty('timer')
			expect(typeof mixin.timer).toBe('function')
		})
	})
})
