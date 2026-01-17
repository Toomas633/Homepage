import { FileType } from '@/enums/fileType'
import { TreeItem } from '@/types/treeview'

export const ORGANIZER_INPUT: TreeItem[] = [
	{
		title: 'your files',
		file: FileType.Folder,
	},
	{
		title: 'movies',
		file: FileType.Folder,
		children: [
			{
				title: 'Venom.2018.BluRay.x264-[YTS.AM].mp4',
				file: FileType.Video,
			},
			{
				title: 'Warcraft.2016.1080p.BluRay.x264-[YTS.AG].mkv',
				file: FileType.Video,
			},
			{
				title: '1917 (2019) [1080p] [BluRay] [5.1] [YTS.MX]',
				file: FileType.Folder,
				children: [
					{
						title: '1917 (2019) [1080p] [BluRay] [5.1] [YTS.MX].mkv',
						file: FileType.Video,
					},
					{
						title: 'English.srt',
						file: FileType.Txt,
					},
					{
						title: 'other files',
						file: FileType.Txt,
					},
				],
			},
			{
				title: '2 Fast 2 Furious (2003) [1080p]',
				file: FileType.Folder,
				children: [
					{
						title: '2 Fast 2 Furious (2003) [1080p].mp4',
						file: FileType.Video,
					},
					{
						title: 'subs',
						file: FileType.Folder,
						children: [
							{
								title: 'English.srt',
								file: FileType.Txt,
							},
							{
								title: 'French.srt',
								file: FileType.Txt,
							},
						],
					},
					{
						title: 'other files',
						file: FileType.Txt,
					},
				],
			},
		],
	},
	{
		title: 'tv',
		file: FileType.Folder,
		children: [
			{
				title: 'Black Bird',
				file: FileType.Folder,
				children: [
					{
						title: 'Black.Bird.S01E01.mp4',
						file: FileType.Video,
					},
					{
						title: 'black.bird.S02E01.mp4',
						file: FileType.Video,
					},
					{
						title: 'subs',
						file: FileType.Folder,
						children: [
							{
								title: 'sub.srt',
								file: FileType.Txt,
							},
						],
					},
					{
						title: 'other files',
						file: FileType.Txt,
					},
				],
			},
			{
				title: 'Colony',
				file: FileType.Folder,
				children: [
					{
						title: 'S01',
						file: FileType.Folder,
						children: [
							{
								title: 'Colony.s01e01.mp4',
								file: FileType.Video,
							},
							{
								title: 'subs',
								file: FileType.Folder,
								children: [
									{
										title: 'sub.srt',
										file: FileType.Txt,
									},
								],
							},
							{
								title: 'other files',
								file: FileType.Txt,
							},
						],
					},
				],
			},
		],
	},
	{
		title: 'your files.txt',
		file: FileType.Txt,
	},
]
