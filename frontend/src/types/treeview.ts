import { FileType } from '@/enums/fileType'

export interface TreeItem {
	title: string
	file: FileType
	comment?: string
	children?: TreeItem[]
}

export interface TreeFolderOptions {
	comment?: string
	children?: TreeItem[]
}
