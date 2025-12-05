import { describe, it, expect, vi, beforeEach } from 'vitest'
import useCopyMixin from '../../src/helpers/copyMixin'

const mockClipboard = {
	writeText: vi.fn(),
}

Object.defineProperty(navigator, 'clipboard', {
	value: mockClipboard,
	writable: true,
	configurable: true,
})

vi.mock('./alertMixin', () => ({
	default: () => ({
		showErrorMessage: vi.fn(),
	}),
}))

vi.mock('./timerMixin', () => ({
	default: () => ({
		timer: vi.fn((callback) => {
			callback(true)
		}),
	}),
}))

describe('copyMixin', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('copy function', () => {
		it('should copy text to clipboard successfully', async () => {
			mockClipboard.writeText.mockResolvedValue(undefined)
			const { copy, error } = useCopyMixin()

			await copy('test content')

			expect(mockClipboard.writeText).toHaveBeenCalledWith('test content')
			expect(error.value).toBe(false)
		})

		it('should handle clipboard write success', async () => {
			mockClipboard.writeText.mockResolvedValue(undefined)
			const { copy, error } = useCopyMixin()

			await copy('successful copy')

			expect(error.value).toBe(false)
		})

		it('should set error state when clipboard write fails', async () => {
			const clipboardError = new Error('Clipboard access denied')
			mockClipboard.writeText.mockRejectedValue(clipboardError)
			const { copy, error } = useCopyMixin()

			await copy('failed content')

			expect(error.value).toBe(true)
		})

		it('should handle empty string', async () => {
			mockClipboard.writeText.mockResolvedValue(undefined)
			const { copy } = useCopyMixin()

			await copy('')

			expect(mockClipboard.writeText).toHaveBeenCalledWith('')
		})

		it('should handle special characters', async () => {
			mockClipboard.writeText.mockResolvedValue(undefined)
			const { copy } = useCopyMixin()
			const specialContent = 'Text with\nnewlines and\ttabs & special <chars>'

			await copy(specialContent)

			expect(mockClipboard.writeText).toHaveBeenCalledWith(specialContent)
		})

		it('should handle long text content', async () => {
			mockClipboard.writeText.mockResolvedValue(undefined)
			const { copy } = useCopyMixin()
			const longContent = 'A'.repeat(10000)

			await copy(longContent)

			expect(mockClipboard.writeText).toHaveBeenCalledWith(longContent)
		})
	})

	describe('reactive state', () => {
		it('should initialize copied state as false', () => {
			const { copied } = useCopyMixin()
			expect(copied.value).toBe(false)
		})

		it('should initialize error state as false', () => {
			const { error } = useCopyMixin()
			expect(error.value).toBe(false)
		})

		it('should update error state on failure', async () => {
			mockClipboard.writeText.mockRejectedValue(new Error('Failed'))
			const { copy, error } = useCopyMixin()

			await copy('test')

			expect(error.value).toBe(true)
		})

		it('should reset error state on successful copy after previous error', async () => {
			const { copy, error } = useCopyMixin()

			mockClipboard.writeText.mockRejectedValue(new Error('Failed'))
			await copy('test')
			expect(error.value).toBe(true)

			mockClipboard.writeText.mockResolvedValue(undefined)
			await copy('test again')
			expect(error.value).toBe(false)
		})
	})

	describe('return value', () => {
		it('should return copied, error, and copy function', () => {
			const mixin = useCopyMixin()

			expect(mixin).toHaveProperty('copied')
			expect(mixin).toHaveProperty('error')
			expect(mixin).toHaveProperty('copy')
			expect(typeof mixin.copy).toBe('function')
		})

		it('should return reactive refs for copied and error', () => {
			const { copied, error } = useCopyMixin()

			expect(copied).toHaveProperty('value')
			expect(error).toHaveProperty('value')
		})
	})
})
