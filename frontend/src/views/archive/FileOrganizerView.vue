<template>
	<v-container>
		<h1 class="text-center">File Organizer</h1>
		<StatsAndChips
			hide-langs
			:repo="repo"
			new-page="Plex Organizer"
			new-link="/projects/plex-organizer" />
		<p :class="!isMobile ? 'text-center' : ''">
			General use file organizer for removing all but the wanted file
			extensions, moving files out of subfolders and deleting empty folders.
			Default file is set up for using with Plex for cleaning up torrent
			downloads (movies and tv shows), but extensions can simply be changed in
			the python script. PS! The code needs a command line argument for the
			working directory.
		</p>
		<p :class="!isMobile ? 'text-center' : ''">
			<b>
				<i>
					I AM NOT RESPONSIBLE FOR ANY DATA LOSS UPON WRONG CONFIGURATION OR
					CODE CHANGES!
				</i>
			</b>
		</p>
		<v-row class="d-block d-sm-flex" justify="center">
			<v-col class="align-content-space-around mt-3">
				<StatsAndChips hide-chips :repo="repo" />
			</v-col>
			<v-col class="align-content-space-around" lg="2" md="3" sm="4" xl="1">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/File-organizer"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<LinkableTitle h1 title="Features" centered />
		<IconList :items="features" />
		<LinkableTitle h1 title="Running" centered />
		<ol>
			<li>
				Download with
				<InlineCode
					code="sudo wget
									https://raw.githubusercontent.com/Toomas633/File-organizer/main/organizer.py" />
				and place it into the folder you want it to search through (see example
				below)
			</li>
			<li>
				Run it in the backround while being in the same folder with
				<InlineCode code="nohup python3 organizer.py <path_to_folder>" />
			</li>
			<li>
				Or run it always after reboot with cron job by adding
				<InlineCode
					code="0 * * * * python3 /<path_to_script>/organizer.py
									<path_to_folder>" />
				using <InlineCode code="sudo crontab -e" /> and adding it to the end of
				the file
			</li>
		</ol>
		<LinkableTitle h1 title="Example file structure" centered />
		<v-row class="d-block d-sm-flex" justify="center">
			<v-col>
				<v-card class="pa-4" elevation="4">
					<h2 class="text-center pb-4">Takes in</h2>
					<TreeviewComponent :items="ORGANIZER_INPUT" />
				</v-card>
			</v-col>
			<v-col>
				<v-card class="pa-4" elevation="4">
					<h2 class="text-center pb-4">Returns</h2>
					<TreeviewComponent :items="outputItems" />
				</v-card>
			</v-col>
		</v-row>
	</v-container>
	<TableOfContents />
</template>

<script setup lang="ts">
import type { IconListItem } from '@/types/iconList'
import { FileType } from '@/enums/fileType'
import type { TreeItem } from '@/types/treeview'
import { isMobile } from '@basitcodeenv/vue3-device-detect'
import { ORGANIZER_INPUT } from '@/constants/organizers'

const repo = 'toomas633/file-organizer'

const features: IconListItem[] = [
	{
		icon: 'mdi-file-document-outline',
		color: '#1e88e5',
		text: 'Log file in the same dir that gets organized called organizer.log (timestamp and operation) (editable in code)',
	},
	{
		icon: 'mdi-console-line',
		color: '#3949ab',
		text: 'Location to the directory containing desired folders for organizing asked as command line argument',
	},
	{
		icon: 'mdi-trash-can-outline',
		color: '#e53935',
		text: 'Removes unwanted files',
	},
	{
		icon: 'mdi-folder-move',
		color: '#00acc1',
		text: 'Moves certain files out of subfolders',
	},
	{
		icon: 'mdi-folder-remove',
		color: '#fb8c00',
		text: 'Deletes empty folders',
	},
	{
		icon: 'mdi-progress-download',
		color: '#43a047',
		text: 'Default config for torrenting uses the .!qB extention for not deleting mid download files (check qbittorrent settings for enabling it)',
	},
]

const outputItems: TreeItem[] = [
	{
		title: 'your files',
		file: FileType.Folder,
	},
	{
		title: 'movies',
		file: FileType.Folder,
		children: [
			{
				title: 'Venom',
				file: FileType.Folder,
				children: [
					{
						title: 'Venom.2018.BluRay.x264-[YTS.AM].mp4',
						file: FileType.Video,
					},
				],
			},
			{
				title: 'Warcraft',
				file: FileType.Folder,
				children: [
					{
						title: 'Warcraft.2016.1080p.BluRay.x264-[YTS.AG].mkv',
						file: FileType.Video,
					},
				],
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
						title: 'English.srt',
						file: FileType.Txt,
					},
					{
						title: 'French.srt',
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
						title: 'sub.srt',
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
								title: 'sub.srt',
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
</script>
