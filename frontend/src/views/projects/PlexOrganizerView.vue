<template>
	<v-container>
		<h1 class="text-center d-flex justify-center align-items-center">
			Plex Organizer
		</h1>
		<StatsAndChips hide-langs :repo="repo" />
		<p :class="!isMobile ? 'text-center' : ''">
			Plex Organizer is a Python-based utility designed to help manage and
			organize media files for Plex Media Server. It automates tasks such as
			renaming files, deleting unwanted files, moving directories, and cleaning
			up empty folders.
		</p>
		<p :class="!isMobile ? 'text-center' : ''">
			<b>
				<i style="color: rgb(var(--v-theme-primary))">
					Any data loss is not on me, but you can still report any bugs or
					faults you find in issues
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
					href="https://github.com/Toomas633/Plex-Organizer"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<LinkableTitle h1 title="Features" centered />
		<IconList :items="features" />
		<br />
		Notes:
		<ul>
			<li>
				Cleanup is intentionally aggressive: only video files (<InlineCode
					code=".mkv" />, <InlineCode code=".mp4" />), in-progress qBittorrent
				files (<InlineCode code=".!qB" />), and the organizer index file
				(<InlineCode code=".plex_organizer.index" />) are kept. Subtitle
				files/folders (e.g. <InlineCode code="Subs/" />,
				<InlineCode code="Subtitles/" />) are removed.
			</li>
			<li>
				If you are organizing while torrents are still downloading, ensure the
				qBittorrent setting
				<b><InlineCode code="Append .!qB extension to incomplete files" /></b>
				is enabled, otherwise incomplete files may be treated as regular files
				and get removed during cleanup.
			</li>
			<li>
				The organizer keeps a per-library index (<InlineCode
					code=".plex_organizer.index" />) so already-processed files can be
				skipped on future runs.
			</li>
			<li>
				If torrent removal is enabled (by providing a torrent hash), the
				qBittorrent Web API must be reachable and credentials must be set.
			</li>
		</ul>
		<LinkableTitle h1 title="Requirements" centered />
		<ul>
			<li>Python 3.x</li>
			<li>Dependencies listed in <InlineCode code="requirements.txt" /></li>
			<li>
				<InlineCode code="ffmpeg" /> / <InlineCode code="ffprobe" /> available
				on PATH (required if
				<InlineCode code="enable_audio_tagging = true" /> and/or
				<InlineCode code="enable_subtitle_embedding = true" />)
			</li>
		</ul>
		<LinkableTitle h1 title="Installation" centered />
		<ol>
			<li>
				Clone the repository:
				<CodeBlock
					code="git clone https://github.com/Toomas633/Plex-Organizer.git
cd Plex-Organizer" />
			</li>
			<li>
				Install dependencies (recommended):
				<CodeBlock code="bash ./install.sh" />
			</li>
		</ol>
		<LinkableTitle h1 title="Update" centered />
		To update to the latest version just run (it will also run
		<InlineCode code="install.sh" /> afterwards):
		<CodeBlock code="./update.sh" />
		<LinkableTitle h1 title="Usage" centered />
		<v-row class="d-block d-md-flex" justify="center">
			<v-col>
				<LinkableTitle h2 title="Manual running" hide-divider />
				To run manually just go to the Plex-Organizer cloned or downloaded
				folder and run:
				<CodeBlock code="./run.sh <start_directory>" />
				<LinkableTitle h2 title="Automated running" />
				Add this command to qBittorrent options under "Run external program on
				torrent finished":
				<CodeBlock
					code="/bin/bash <path_to_script>/run.sh <start_directory> <torrent_hash>" />
				<b>Arguments:</b>
				<ul>
					<li>
						&lt;start_directory&gt;: The base directory containing the tv and
						movies subdirectories, or <b>%D</b> (qBittorrent) to organize only
						the specific completed torrent folder.
						<b>
							For performance and safety reasons it is highly recommended to use
							the torrent specific folder option (<b>%D</b>) when running
							automatically.
						</b>
					</li>
					<li>
						&lt;torrent_hash&gt; <i>(Optional)</i>: The hash of the torrent to
						be removed (omit for testing purposes or to ignore torrent automatic
						removal). Argument %I in qBittorrent UI.
					</li>
				</ul>
				<b>
					Be sure to put arguments between quotes like "%D" to avoid whitespace
					cutoffs.
				</b>
				<br />
				Start directory should have either:
				<ul>
					<li>
						The folders for movies and tv as shown in the example. Show names
						are taken from the parent folder inside tv folder and only episode,
						season and quality are taken from the file names.
					</li>
					<li>
						Just the given torrent save path folder (<b>%D</b> option in
						qBittorrent).
					</li>
				</ul>
			</v-col>
			<v-col md="6" lg="5">
				<v-img
					rounded
					style="cursor: zoom-in"
					:src="Example"
					alt="qBittorrent external program example"
					position="center"
					@click="openImageInNewTab(Example)" />
			</v-col>
		</v-row>
		<LinkableTitle h1 title="Configuration" centered />
		All user configuration is handled in <InlineCode code="config.ini" />. The
		file is auto-managed on startup:
		<ul>
			<li>Missing required sections/options are added.</li>
			<li>Unknown options inside known sections are removed.</li>
		</ul>
		Key sections:
		<ul>
			<li>
				<InlineCode code="[qBittorrent]" /> (<InlineCode code="host" />,
				<InlineCode code="username" />, <InlineCode code="password" />)
			</li>
			<li>
				<InlineCode code="[Settings]" /> (<InlineCode
					code="delete_duplicates" />, <InlineCode code="include_quality" />,
				<InlineCode code="capitalize" />, <InlineCode code="cpu_threads" />)
			</li>
			<li>
				<InlineCode code="[Logging]" /> (<InlineCode code="enable_logging" />,
				<InlineCode code="log_file" />, <InlineCode code="clear_log" />,
				<InlineCode code="timestamped_log_files" />,
				<InlineCode code="level" />)
			</li>
			<li>
				<InlineCode code="[Audio]" /> (<InlineCode
					code="enable_audio_tagging" />,
				<InlineCode code="whisper_model_size" />)
			</li>
			<li>
				<InlineCode code="[Subtitles]" /> (<InlineCode
					code="enable_subtitle_embedding" />)
			</li>
		</ul>
		<b>NB!!</b> Make sure the qBittorrent <InlineCode code="host" /> is correct.
		Torrent removal is best-effort: failures are logged and processing
		continues.
		<CodeBlock :code="exampleConfig" />
		<LinkableTitle h1 title="Example file structure" centered />
		<v-row class="pt-0 d-block d-sm-flex" justify="center">
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
import { TreeItem } from '@/types/treeview'
import Example from '@/assets/images/plex-organizer/example.png'
import useImageMixin from '@/helpers/imageMixin'
import useIconListMixin from '@/helpers/iconListMixin'
import { isMobile } from '@basitcodeenv/vue3-device-detect'
import { ORGANIZER_INPUT } from '@/constants/organizers'

const { openImageInNewTab } = useImageMixin()
const { createPreset, iconListPresets } = useIconListMixin()

const repo = 'toomas633/plex-organizer'

const plexFeaturePresets = {
	torrentRemoval: createPreset({ icon: 'mdi-download', color: '#e53935' }),
	fileRenaming: createPreset({ icon: 'mdi-rename-box', color: '#8e24aa' }),
	unwantedFileDeletion: createPreset({
		icon: 'mdi-trash-can-outline',
		color: '#d32f2f',
	}),
	directoryManagement: createPreset({
		icon: 'mdi-folder-move',
		color: '#3949ab',
	}),
	customizableDirectories: createPreset({
		icon: 'mdi-folder-cog',
		color: '#00897b',
	}),
	handlePlex: createPreset({
		icon: 'mdi-television-play',
		color: '#1e88e5',
	}),
	audioLanguageTagging: createPreset({
		icon: 'mdi-ear-hearing',
		color: '#00acc1',
	}),
	subtitleEmbedding: createPreset({ icon: 'mdi-subtitles', color: '#43a047' }),
}

const features: IconListItem[] = [
	plexFeaturePresets.torrentRemoval({
		title: 'Torrent Removal',
		text: 'Removes torrents from the client after processing.',
	}),
	plexFeaturePresets.fileRenaming({
		title: 'File Renaming',
		text: 'Automatically renames media files based on predefined rules for TV shows and movies.',
	}),
	plexFeaturePresets.unwantedFileDeletion({
		title: 'Unwanted File Deletion',
		text: 'Removes unnecessary files/folders from specified directories.',
	}),
	plexFeaturePresets.directoryManagement({
		title: 'Directory Management',
		text: 'Moves directories to their appropriate locations and deletes empty directories.',
	}),
	plexFeaturePresets.customizableDirectories({
		title: 'Customizable Directories',
		text: 'Supports separate directories for TV shows and movies.',
	}),
	plexFeaturePresets.handlePlex({
		title: 'Handle Plex',
		text: 'Handles plex directories and optimized versions.',
	}),
	plexFeaturePresets.audioLanguageTagging({
		title: 'Audio language tagging (optional)',
		text: 'If enabled, detects missing audio track languages and writes ISO 639-2 tags into the container metadata (uses ffprobe / ffmpeg + faster-whisper).',
	}),
	plexFeaturePresets.subtitleEmbedding({
		title: 'Subtitle embedding (optional)',
		text: 'If enabled, embeds external subtitles into the video file and tags subtitle language/type metadata (uses ffprobe / ffmpeg + langdetect).',
	}),
	iconListPresets.configFile({
		title: 'Config File',
		text: 'Ini file for common configuration options that can be set, disabled or enabled easily.',
	}),
]

const exampleConfig = `[qBittorrent]
host = http://localhost:8081 #host address and port of qBittorrent webui api
username = admin #username for qBittorrent webui api
password = adminadmin #password for qBittorrent webui api

[Settings]
delete_duplicates = true #should duplicate files be deleted or kept
include_quality = false #should quality be included in file names
capitalize = true #should file names be capitalized
cpu_threads = 0 #limits CPU parallelism for some processing steps (0 = auto)

[Logging]
enable_logging = true #if logging should be enabled
log_file = qbittorrent.log #log file name
clear_log = false #if log should be cleared on start
timestamped_log_files = false #if log files should be timestamped and not overwritten on each run
level = INFO #log level (DEBUG, INFO)

[Audio]
enable_audio_tagging = true #if audio language tags should be embedded
whisper_model_size = tiny #whisper model size to use for audio language detection (tiny, base, small, medium, large)

[Subtitles]
enable_subtitle_embedding = true #if subtitles should be embedded into video files
`

const outputItems: TreeItem[] = [
	{
		title: 'your folders',
		file: FileType.Folder,
	},
	{
		title: 'movies',
		file: FileType.Folder,
		children: [
			{
				title: '1917 (2019) 1080p.mp4',
				file: FileType.Video,
			},
			{
				title: '2 Fast 2 Furious (2003) 1080p.mp4',
				file: FileType.Video,
			},
			{
				title: 'Venom (2018).mp4',
				file: FileType.Video,
			},
			{
				title: 'Warcraft (2016) 1080p.mkv',
				file: FileType.Video,
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
						title: 'Season 1',
						file: FileType.Folder,
						children: [
							{
								title: 'Black Bird S01E01.mp4',
								file: FileType.Video,
							},
						],
					},
					{
						title: 'Season 2',
						file: FileType.Folder,
						children: [
							{
								title: 'Black Bird S02E01.mp4',
								file: FileType.Video,
							},
						],
					},
				],
			},
			{
				title: 'Colony',
				file: FileType.Folder,
				children: [
					{
						title: 'Season 1',
						file: FileType.Folder,
						children: [
							{
								title: 'Colony S01E01.mp4',
								file: FileType.Video,
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
