import { Router } from 'express'
import type { Response } from 'express'
import { githubService } from '../services/githubService.js'
import type {
	ApiResponse,
	GitHubRequest,
	GitHubResponse,
} from '../types/index.js'

const router = Router()

router.post(
	'/github',
	async (
		req: GitHubRequest,
		res: Response<ApiResponse<GitHubResponse | null>>
	) => {
		const repo = typeof req.body?.repo === 'string' ? req.body.repo.trim() : ''

		if (!repo) {
			res.status(400).json({
				success: false,
				message: 'Missing required field: repo',
			})
			return
		}

		const repoPattern = /^[^/\s]+\/[^/\s]+$/
		if (!repoPattern.test(repo)) {
			res.status(400).json({
				success: false,
				message: "Invalid repository format. Use 'owner/repo'",
			})
			return
		}

		try {
			const data = await githubService.queryData(repo)
			res.status(200).json({ success: true, data })
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			res.status(500).json({
				success: false,
				message: 'Error fetching GitHub Data',
				error: errorMessage,
			})
		}
	}
)

export default router
