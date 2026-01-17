import express, { Router } from 'express'
import type { Request, Response } from 'express'
import getAbsoluteSwaggerFsPath from 'swagger-ui-dist/absolute-path'
import { swaggerSpec } from '../config/swagger.js'
import swaggerUi from 'swagger-ui-express'

const router = Router()
const swaggerUiDistPath = getAbsoluteSwaggerFsPath()

router.use(
	'/swagger-ui',
	express.static(swaggerUiDistPath, { index: false }),
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		customSiteTitle: "Toomas633's Dungeon API Documentation",
		customCss: `.swagger-ui .topbar .topbar-wrapper {
				display: flex;
				align-items: center;
				gap: 16px;
			}
			.swagger-ui .topbar .topbar-wrapper > * {
				flex: 0 0 auto;
			}
			.swagger-ui .topbar .topbar-wrapper .dark-mode-toggle {
				margin-left: auto;
				order: 999;
			}
			.swagger-ui .topbar .topbar-wrapper .download-url-wrapper {
				order: 1;
			}`,
		swaggerOptions: {
			persistAuthorization: true,
		},
	})
)

router.get('/api/swagger-ui.json', (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json')
	res.send(swaggerSpec)
})

export default router
