import { Router } from 'express'
import type { Request, Response } from 'express'
import { githubService } from '../services/githubService.js'
import type { ApiResponse, GitHubResponse } from '../types/index.js'

const router = Router()

router.post(
	'/api/github',
	async (req: Request, res: Response<ApiResponse<GitHubResponse | null>>) => {
		const { repo } = req.body

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
