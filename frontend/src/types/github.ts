export interface License {
	key: string
	name: string
	node_id: string
	spdx_id: string
	url: string
}

export interface Language {
	name: string
	count: number
}

export interface RepoInfo {
	license?: License
	languages: Language[]
	latestRelease?: string
}
