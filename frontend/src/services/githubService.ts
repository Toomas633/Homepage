import useAlertMixin from '@/helpers/alertMixin'
import { RepoInfo } from '@/types/github'
import axios, { AxiosError } from 'axios'
import { API_URL } from '@/constants/env'

const { showErrorMessage } = useAlertMixin()

const githubApi = axios.create({
	baseURL: API_URL,
})

export async function getRepoInfo(repo: string): Promise<RepoInfo | undefined> {
	return githubApi
		.post(`/github`, { repo })
		.then((res) => res.data.data)
		.catch((error: AxiosError) => {
			showErrorMessage(error)
			return undefined
		})
}
