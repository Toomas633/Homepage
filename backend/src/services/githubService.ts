import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { config } from '../config/env.js'
import type { License, Language, GitHubResponse } from '../types/index.js'

class GithubService {
	private readonly api: AxiosInstance

	constructor() {
		this.api = axios.create({
			baseURL: `https://api.github.com/repos/`,
			headers: {
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
				...(config.github.token
					? { Authorization: `Bearer ${config.github.token}` }
					: {}),
			},
		})
	}

	async queryData(repo: string): Promise<GitHubResponse> {
		const license = await this.getLicense(repo)
		const languages = await this.getLanguages(repo)
		const latestRelease = await this.getLatestRelease(repo)
		return { license, languages, latestRelease }
	}

	async getLicense(repo: string): Promise<License | undefined> {
		try {
			const response = await this.api.get(`/${repo}/license`)
			return response.data.license
		} catch (error) {
			console.error(`Error fetching license for ${repo}:`, error)
			return undefined
		}
	}

	async getLanguages(repo: string): Promise<Language[]> {
		try {
			const response = await this.api.get(`/${repo}/languages`)
			const records = response.data as Record<string, number>
			const languages = Object.keys(records).map((key) => ({
				name: key,
				count: records[key],
			}))
			return languages
		} catch (error) {
			console.error(`Error fetching languages for ${repo}:`, error)
			return []
		}
	}

	async getLatestRelease(repo: string): Promise<string | undefined> {
		try {
			const response = await this.api.get(`/${repo}/releases/latest`)
			return response.data.tag_name
		} catch (error) {
			console.error(`Error fetching latest release for ${repo}:`, error)
			return undefined
		}
	}
}

export const githubService = new GithubService()
