import { describe, it, expect, vi, beforeEach } from 'vitest'
import useAlertMixin from '../../src/helpers/alertMixin'
import { EventBus } from '../../src/util/eventBus'
import { EventType } from '../../src/enums/eventType'
import { PopupType } from '../../src/enums/popupType'

vi.mock('../../src/util/eventBus', () => ({
	EventBus: {
		emit: vi.fn(),
	},
}))

describe('alertMixin', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('showErrorMessage', () => {
		it('should emit error alert with correct message', () => {
			const { showErrorMessage } = useAlertMixin()
			const error = new Error('Test error message')

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})
			showErrorMessage(error)

			expect(consoleErrorSpy).toHaveBeenCalledWith(error)
			expect(EventBus.emit).toHaveBeenCalledWith(EventType.SHOW_ALERT_MESSAGE, {
				message: 'Test error message',
				type: PopupType.Error,
				stack: error.stack,
			})

			consoleErrorSpy.mockRestore()
		})

		it('should include error stack trace', () => {
			const { showErrorMessage } = useAlertMixin()
			const error = new Error('Test error')

			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})
			showErrorMessage(error)

			expect(EventBus.emit).toHaveBeenCalledWith(
				EventType.SHOW_ALERT_MESSAGE,
				expect.objectContaining({
					stack: expect.any(String),
				})
			)

			consoleErrorSpy.mockRestore()
		})

		it('should log error to console', () => {
			const { showErrorMessage } = useAlertMixin()
			const consoleErrorSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {})
			const error = new Error('Console test')

			showErrorMessage(error)

			expect(consoleErrorSpy).toHaveBeenCalledWith(error)
			consoleErrorSpy.mockRestore()
		})
	})

	describe('showSuccessMessage', () => {
		it('should emit success alert with correct message', () => {
			const { showSuccessMessage } = useAlertMixin()
			const message = 'Operation successful'

			showSuccessMessage(message)

			expect(EventBus.emit).toHaveBeenCalledWith(EventType.SHOW_ALERT_MESSAGE, {
				message: 'Operation successful',
				type: PopupType.Success,
			})
		})

		it('should handle empty message', () => {
			const { showSuccessMessage } = useAlertMixin()

			showSuccessMessage('')

			expect(EventBus.emit).toHaveBeenCalledWith(EventType.SHOW_ALERT_MESSAGE, {
				message: '',
				type: PopupType.Success,
			})
		})

		it('should handle special characters in message', () => {
			const { showSuccessMessage } = useAlertMixin()
			const message = 'Success with <special> & "characters"'

			showSuccessMessage(message)

			expect(EventBus.emit).toHaveBeenCalledWith(EventType.SHOW_ALERT_MESSAGE, {
				message: 'Success with <special> & "characters"',
				type: PopupType.Success,
			})
		})
	})

	describe('showWarningMessage', () => {
		it('should emit warning alert with correct message', () => {
			const { showWarningMessage } = useAlertMixin()
			const message = 'This is a warning'

			const consoleWarnSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {})
			showWarningMessage(message)

			expect(consoleWarnSpy).toHaveBeenCalledWith(message)
			expect(EventBus.emit).toHaveBeenCalledWith(EventType.SHOW_ALERT_MESSAGE, {
				message: 'This is a warning',
				type: PopupType.Warn,
			})

			consoleWarnSpy.mockRestore()
		})

		it('should log warning to console', () => {
			const { showWarningMessage } = useAlertMixin()
			const consoleWarnSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {})
			const message = 'Console warning test'

			showWarningMessage(message)

			expect(consoleWarnSpy).toHaveBeenCalledWith(message)
			consoleWarnSpy.mockRestore()
		})
	})

	describe('showInfoMessage', () => {
		it('should emit info alert with correct message', () => {
			const { showInfoMessage } = useAlertMixin()
			const message = 'Informational message'

			showInfoMessage(message)

			expect(EventBus.emit).toHaveBeenCalledWith(EventType.SHOW_ALERT_MESSAGE, {
				message: 'Informational message',
				type: PopupType.Info,
			})
		})

		it('should handle long messages', () => {
			const { showInfoMessage } = useAlertMixin()
			const longMessage = 'A'.repeat(500)

			showInfoMessage(longMessage)

			expect(EventBus.emit).toHaveBeenCalledWith(EventType.SHOW_ALERT_MESSAGE, {
				message: longMessage,
				type: PopupType.Info,
			})
		})
	})

	describe('return value', () => {
		it('should return all alert functions', () => {
			const mixin = useAlertMixin()

			expect(mixin).toHaveProperty('showErrorMessage')
			expect(mixin).toHaveProperty('showSuccessMessage')
			expect(mixin).toHaveProperty('showWarningMessage')
			expect(mixin).toHaveProperty('showInfoMessage')
			expect(typeof mixin.showErrorMessage).toBe('function')
			expect(typeof mixin.showSuccessMessage).toBe('function')
			expect(typeof mixin.showWarningMessage).toBe('function')
			expect(typeof mixin.showInfoMessage).toBe('function')
		})
	})
})
