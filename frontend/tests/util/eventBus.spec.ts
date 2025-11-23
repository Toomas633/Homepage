import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventBus } from '../../src/util/eventBus'
import { EventType } from '../../src/enums/eventType'
import { PopupType } from '../../src/enums/popupType'
import type { PopupMessage } from '../../src/types/popup'

describe('EventBus', () => {
	const alertEvent = EventType.SHOW_ALERT_MESSAGE

	beforeEach(() => {
		EventBus.all.clear()
	})

	it('should be defined', () => {
		expect(EventBus).toBeDefined()
	})

	it('should emit and receive events', () => {
		const handler = vi.fn()
		EventBus.on(alertEvent, handler)

		const message: PopupMessage = {
			message: 'Test message',
			type: PopupType.Info,
		}

		EventBus.emit(alertEvent, message)

		expect(handler).toHaveBeenCalledWith(message)
		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('should support multiple listeners for same event', () => {
		const handler1 = vi.fn()
		const handler2 = vi.fn()

		EventBus.on(alertEvent, handler1)
		EventBus.on(alertEvent, handler2)

		const message: PopupMessage = {
			message: 'Test',
			type: PopupType.Success,
		}

		EventBus.emit(alertEvent, message)

		expect(handler1).toHaveBeenCalledWith(message)
		expect(handler2).toHaveBeenCalledWith(message)
	})

	it('should remove event listeners', () => {
		const handler = vi.fn()
		EventBus.on(alertEvent, handler)

		const message: PopupMessage = {
			message: 'Test',
			type: PopupType.Info,
		}

		EventBus.emit(alertEvent, message)
		expect(handler).toHaveBeenCalledTimes(1)

		EventBus.off(alertEvent, handler)
		EventBus.emit(alertEvent, message)

		expect(handler).toHaveBeenCalledTimes(1)
	})

	it('should handle error messages', () => {
		const handler = vi.fn()
		EventBus.on(alertEvent, handler)

		const errorMessage: PopupMessage = {
			message: 'An error occurred',
			type: PopupType.Error,
			stack: 'Error stack trace',
		}

		EventBus.emit(alertEvent, errorMessage)

		expect(handler).toHaveBeenCalledWith(errorMessage)
		expect(handler.mock.calls[0][0]).toHaveProperty('stack')
	})

	it('should handle success messages', () => {
		const handler = vi.fn()
		EventBus.on(alertEvent, handler)

		const successMessage: PopupMessage = {
			message: 'Operation successful',
			type: PopupType.Success,
		}

		EventBus.emit(alertEvent, successMessage)

		expect(handler).toHaveBeenCalledWith(successMessage)
	})

	it('should handle warning messages', () => {
		const handler = vi.fn()
		EventBus.on(alertEvent, handler)

		const warningMessage: PopupMessage = {
			message: 'This is a warning',
			type: PopupType.Warn,
		}

		EventBus.emit(alertEvent, warningMessage)

		expect(handler).toHaveBeenCalledWith(warningMessage)
	})

	it('should not call handlers after they are removed', () => {
		const handler1 = vi.fn()
		const handler2 = vi.fn()

		EventBus.on(alertEvent, handler1)
		EventBus.on(alertEvent, handler2)

		EventBus.off(alertEvent, handler1)

		const message: PopupMessage = {
			message: 'Test',
			type: PopupType.Info,
		}

		EventBus.emit(alertEvent, message)

		expect(handler1).not.toHaveBeenCalled()
		expect(handler2).toHaveBeenCalledWith(message)
	})

	it('should handle multiple sequential events', () => {
		const handler = vi.fn()
		EventBus.on(alertEvent, handler)

		const message1: PopupMessage = {
			message: 'First message',
			type: PopupType.Info,
		}

		const message2: PopupMessage = {
			message: 'Second message',
			type: PopupType.Success,
		}

		EventBus.emit(alertEvent, message1)
		EventBus.emit(alertEvent, message2)

		expect(handler).toHaveBeenCalledTimes(2)
		expect(handler).toHaveBeenNthCalledWith(1, message1)
		expect(handler).toHaveBeenNthCalledWith(2, message2)
	})

	it('should support wildcard listeners', () => {
		const wildcardHandler = vi.fn()
		EventBus.on('*', wildcardHandler)

		const message: PopupMessage = {
			message: 'Test',
			type: PopupType.Info,
		}

		EventBus.emit(alertEvent, message)

		expect(wildcardHandler).toHaveBeenCalled()
	})

	it('should clear all event handlers', () => {
		const handler1 = vi.fn()
		const handler2 = vi.fn()

		EventBus.on(alertEvent, handler1)
		EventBus.on(alertEvent, handler2)

		EventBus.all.clear()

		const message: PopupMessage = {
			message: 'Test',
			type: PopupType.Info,
		}

		EventBus.emit(alertEvent, message)

		expect(handler1).not.toHaveBeenCalled()
		expect(handler2).not.toHaveBeenCalled()
	})
})
