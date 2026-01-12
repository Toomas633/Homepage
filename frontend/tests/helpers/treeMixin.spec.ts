import { describe, it, expect } from 'vitest'

import { FileType } from '../../src/enums/fileType'
import useTreeMixin from '../../src/helpers/treeMixin'
import type { TreeItem } from '../../src/types/treeview'

describe('treeMixin', () => {
	it('should return treeItem and treePresets', () => {
		const mixin = useTreeMixin()

		expect(mixin).toHaveProperty('treeItem')
		expect(mixin).toHaveProperty('treePresets')
		expect(typeof mixin.treeItem).toBe('object')
		expect(typeof mixin.treePresets).toBe('object')
	})

	describe('treeItem.folder', () => {
		it('should create a folder item with title and folder type', () => {
			const { treeItem } = useTreeMixin()
			const item = treeItem.folder('src')

			expect(item).toEqual({
				title: 'src',
				file: FileType.Folder,
			})
		})

		it('should add comment when provided', () => {
			const { treeItem } = useTreeMixin()
			const item = treeItem.folder('src', { comment: 'Source folder' })

			expect(item).toMatchObject({
				title: 'src',
				file: FileType.Folder,
				comment: 'Source folder',
			})
		})

		it('should omit comment when empty string is provided', () => {
			const { treeItem } = useTreeMixin()
			const item = treeItem.folder('src', { comment: '' })

			expect(item).not.toHaveProperty('comment')
		})

		it('should add children when a non-empty array is provided', () => {
			const { treeItem } = useTreeMixin()
			const children: TreeItem[] = [
				{ title: 'package.json', file: FileType.Code },
			]
			const item = treeItem.folder('src', { children })

			expect(item.children).toEqual(children)
		})

		it('should omit children when an empty array is provided', () => {
			const { treeItem } = useTreeMixin()
			const item = treeItem.folder('src', { children: [] })

			expect(item).not.toHaveProperty('children')
		})
	})

	describe('treeItem.file', () => {
		it('should create a file item with title and type', () => {
			const { treeItem } = useTreeMixin()
			const item = treeItem.file('README.md', FileType.Txt)

			expect(item).toEqual({
				title: 'README.md',
				file: FileType.Txt,
			})
		})

		it('should add comment when provided', () => {
			const { treeItem } = useTreeMixin()
			const item = treeItem.file('README.md', FileType.Txt, 'Docs')

			expect(item).toEqual({
				title: 'README.md',
				file: FileType.Txt,
				comment: 'Docs',
			})
		})

		it('should omit comment when empty string is provided', () => {
			const { treeItem } = useTreeMixin()
			const item = treeItem.file('README.md', FileType.Txt, '')

			expect(item).not.toHaveProperty('comment')
		})
	})

	describe('treePresets', () => {
		it('vscodeFolder should use default comment', () => {
			const { treePresets } = useTreeMixin()
			const item = treePresets.vscodeFolder()

			expect(item).toEqual({
				title: '.vscode',
				file: FileType.Folder,
				comment: 'VS Code settings',
			})
		})

		it('vscodeFolder should allow overriding comment', () => {
			const { treePresets } = useTreeMixin()
			const item = treePresets.vscodeFolder('Editor config')

			expect(item.comment).toBe('Editor config')
		})

		it('testsFolder should use default comment', () => {
			const { treePresets } = useTreeMixin()
			const item = treePresets.testsFolder()

			expect(item).toEqual({
				title: 'tests',
				file: FileType.Folder,
				comment: 'Vitest tests',
			})
		})

		it('srcFolder should include provided comment and children', () => {
			const { treePresets } = useTreeMixin()
			const children: TreeItem[] = [{ title: 'main.ts', file: FileType.Code }]
			const item = treePresets.srcFolder('Source code', children)

			expect(item).toEqual({
				title: 'src',
				file: FileType.Folder,
				comment: 'Source code',
				children,
			})
		})

		it('packageJson should create a code file item', () => {
			const { treePresets } = useTreeMixin()
			const item = treePresets.packageJson('npm metadata')

			expect(item).toEqual({
				title: 'package.json',
				file: FileType.Code,
				comment: 'npm metadata',
			})
		})

		it('tsconfigJson should create a config file item', () => {
			const { treePresets } = useTreeMixin()
			const item = treePresets.tsconfigJson('TS config')

			expect(item).toEqual({
				title: 'tsconfig.json',
				file: FileType.Config,
				comment: 'TS config',
			})
		})

		it('readme should create a txt file item', () => {
			const { treePresets } = useTreeMixin()
			const item = treePresets.readme()

			expect(item).toEqual({
				title: 'README.md',
				file: FileType.Txt,
			})
		})
	})
})
