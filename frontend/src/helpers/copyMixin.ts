import { ref } from 'vue'
import useAlertMixin from './alertMixin'
import useTimerMixin from './timerMixin'
import { trackEvent } from '@/services/analyticsService'

export default function useCopyMixin() {
	const error = ref(false)
	const copied = ref(false)

	const { showErrorMessage } = useAlertMixin()
	const { timer } = useTimerMixin()

	async function copy(content: string) {
		try {
			await navigator.clipboard.writeText(content)
			error.value = false
			trackEvent('copy_text')
		} catch (e) {
			showErrorMessage(e as Error)
			error.value = true
		}
		timer((value: boolean) => {
			copied.value = value
		}, 3000)
	}

	return { copied, error, copy }
}
