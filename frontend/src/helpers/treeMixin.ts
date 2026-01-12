import { FileType } from '@/enums/fileType'
import type { TreeFolderOptions, TreeItem } from '@/types/treeview'

export default function useTreeMixin() {
	const treeItem = {
		folder: (title: string, options?: TreeFolderOptions): TreeItem => {
			const item: TreeItem = {
				title,
				file: FileType.Folder,
			}

			if (options?.comment) {
				item.comment = options.comment
			}

			if (options?.children?.length) {
				item.children = options.children
			}

			return item
		},
		file: (title: string, file: FileType, comment?: string): TreeItem => {
			const item: TreeItem = {
				title,
				file,
			}

			if (comment) {
				item.comment = comment
			}

			return item
		},
	}

	const treePresets = {
		vscodeFolder: (comment = 'VS Code settings'): TreeItem =>
			treeItem.folder('.vscode', { comment }),
		testsFolder: (comment = 'Vitest tests'): TreeItem =>
			treeItem.folder('tests', { comment }),
		srcFolder: (comment: string, children: TreeItem[]): TreeItem =>
			treeItem.folder('src', { comment, children }),
		packageJson: (comment?: string): TreeItem =>
			treeItem.file('package.json', FileType.Code, comment),
		tsconfigJson: (comment?: string): TreeItem =>
			treeItem.file('tsconfig.json', FileType.Config, comment),
		readme: (): TreeItem => treeItem.file('README.md', FileType.Txt),
	}

	return { treeItem, treePresets }
}
