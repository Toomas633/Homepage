import swaggerJsdoc from 'swagger-jsdoc'
import type { Options, SwaggerDefinition } from 'swagger-jsdoc'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerDefinition = yaml.load(
	fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8')
) as SwaggerDefinition

const swaggerPaths = yaml.load(
	fs.readFileSync(path.join(__dirname, 'swagger-paths.yaml'), 'utf8')
) as { paths: Record<string, unknown> }

const options: Options = {
	definition: {
		...swaggerDefinition,
		...swaggerPaths,
	},
	apis: [],
}

export const swaggerSpec = swaggerJsdoc(options)
