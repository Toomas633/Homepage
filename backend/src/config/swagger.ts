import swaggerJsdoc from 'swagger-jsdoc'
import type { Options, SwaggerDefinition } from 'swagger-jsdoc'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const moduleDirname = (() => {
	if (typeof __dirname !== 'undefined') {
		return __dirname
	}

	return path.join(process.cwd(), 'src')
})()

const readYamlFileFromKnownLocations = (fileName: string): string => {
	const configDir =
		path.basename(moduleDirname) === 'config'
			? moduleDirname
			: path.join(moduleDirname, 'config')
	const yamlPath = path.join(configDir, fileName)

	if (fs.existsSync(yamlPath)) {
		return fs.readFileSync(yamlPath, 'utf8')
	}

	throw new Error(`Swagger file '${fileName}' not found. Tried: ${yamlPath}`)
}

const swaggerDefinition = yaml.load(
	readYamlFileFromKnownLocations('swagger.yaml')
) as SwaggerDefinition

const swaggerPaths = yaml.load(
	readYamlFileFromKnownLocations('swagger-paths.yaml')
) as { paths: Record<string, unknown> }

const options: Options = {
	definition: {
		...swaggerDefinition,
		...swaggerPaths,
	},
	apis: [],
}

export const swaggerSpec = swaggerJsdoc(options) as swaggerJsdoc.OAS3Definition
