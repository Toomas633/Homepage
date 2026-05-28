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
				The organizer keeps a per-library index (<InlineCode
					code=".plex_organizer.index" />) so already-processed files can be
				skipped on future runs.
			</li>
			<li>
				If the start directory is not a recognised media folder (does not
				contain <InlineCode code="tv" /> or <InlineCode code="movies" /> in its
				path and is not a main folder with <InlineCode code="tv/" /> or
				<InlineCode code="movies/" /> subfolders), the organizer removes the
				torrent (if a hash was provided) and exits — no files are deleted,
				moved, or modified.
			</li>
			<li>
				If qBittorrent torrent removal is enabled (by providing a torrent hash),
				the qBittorrent Web API must be reachable and credentials must be set.
			</li>
		</ul>
		<LinkableTitle h1 title="Requirements" centered />
		<ul>
			<li>Python 3.10+</li>
			<li>
				<b>Root privileges</b> — the organizer must be run as root (<InlineCode
					code="sudo" />)
			</li>
			<li>
				<InlineCode code="ffmpeg" /> / <InlineCode code="ffprobe" /> — required
				when <InlineCode code="enable_audio_tagging = true" /> and/or
				<InlineCode code="enable_subtitle_embedding = true" /> (must be
				available on PATH)
			</li>
			<li>
				<InlineCode code="ffsubsync" /> — required when
				<InlineCode code="enable_subtitle_syncing = true" /> (install via
				<InlineCode code="pip install ffsubsync" />)
			</li>
		</ul>
		<LinkableTitle h1 title="Data directory" centered />
		By default, <InlineCode code="config.ini" />, log files, and the lock file
		are stored in <InlineCode code="/root/.config/plex-organizer/" />.
		<br /><br />
		The location can be overridden with the
		<InlineCode code="PLEX_ORGANIZER_DIR" /> environment variable, or by running
		from a directory that already contains a <InlineCode code="config.ini" />.
		<LinkableTitle h1 title="Installation" centered />
		Install directly from GitHub with
		<a href="https://pipx.pypa.io/" target="_blank" rel="noopener noreferrer"
			>pipx</a
		>
		(recommended) — no need to clone the repo. Since the organizer requires root
		privileges, install as root so the command is available on root's PATH:
		<CodeBlock
			code="sudo pipx install git+https://github.com/Toomas633/Plex-Organizer.git
sudo pipx ensurepath" />
		This gives you the <InlineCode code="plex-organizer" /> command on root's
		PATH.
		<LinkableTitle h1 title="Update" centered />
		To update to the latest version run:
		<CodeBlock code="sudo pipx upgrade plex-organizer" />
		<LinkableTitle h1 title="Usage" centered />
		<v-row class="d-block d-md-flex" justify="center">
			<v-col>
				<LinkableTitle h2 title="Manual running" hide-divider />
				Run the main pipeline:
				<CodeBlock code="sudo plex-organizer <start_directory>" />
				Launch the interactive management menu (logs, config migration, custom
				runs):
				<CodeBlock code="sudo plex-organizer --manage" />
				<LinkableTitle h2 title="Automated running" />
				Add this command to qBittorrent options under "Run external program on
				torrent finished":
				<CodeBlock
					code="sudo plex-organizer <start_directory> <torrent_hash>" />
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
					code="enable_subtitle_embedding" />,
				<InlineCode code="analyze_embedded_subtitles" />,
				<InlineCode code="fetch_subtitles" />,
				<InlineCode code="subtitle_providers" />,
				<InlineCode code="sync_subtitles" />)
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
	subtitleFetching: createPreset({
		icon: 'mdi-cloud-download-outline',
		color: '#f57c00',
	}),
	subtitleSyncing: createPreset({ icon: 'mdi-sync', color: '#7b1fa2' }),
	qualityDetection: createPreset({
		icon: 'mdi-quality-high',
		color: '#00796b',
	}),
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
	plexFeaturePresets.subtitleFetching({
		title: 'Subtitle fetching (optional)',
		text: 'If enabled, searches free online subtitle providers (OpenSubtitles, Podnapisi, Gestdown, TVsubtitles) for missing subtitles in configured languages and embeds them into videos.',
	}),
	plexFeaturePresets.subtitleSyncing({
		title: 'Subtitle syncing (optional)',
		text: 'If enabled, synchronizes embedded subtitle timing to the audio track using ffsubsync. Only text-based subtitle streams are synced; bitmap formats (PGS, VobSub) are left unchanged.',
	}),
	plexFeaturePresets.qualityDetection({
		title: 'Quality detection fallback',
		text: 'When include_quality is enabled but no quality tag is found in the filename, the organizer probes the actual video stream height via ffprobe and maps it to the nearest standard label (2160p, 1440p, 1080p, 720p, 480p).',
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
analyze_embedded_subtitles = true #if already-embedded subtitle streams should also be analyzed for missing/unknown language tags
fetch_subtitles = eng #comma-separated ISO 639-2 language codes to fetch (e.g. eng or eng, est); leave empty to disable
subtitle_providers = opensubtitles, podnapisi, gestdown, tvsubtitles #comma-separated list of subtitle providers
sync_subtitles = true #if embedded subtitle timing should be synchronized to the audio track after all other subtitle operations
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
