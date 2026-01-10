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
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Features" centered />
		<ul class="ml-4">
			<li>
				Log file in the same dir that gets organized called organizer.log (time
				stamp and operation) (editable in code)
			</li>
			<li>
				Location to the directory containing desired folders for organizing
				asked as command line argument
			</li>
			<li>Removes unwanted files</li>
			<li>Moves certain files out of subfolders</li>
			<li>Deletes empty folders</li>
			<li>
				Default config for torrenting uses the .!qB extention for not deleting
				mid download files (check qbittorrent settings for enabling it)
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Running" centered />
		<ul class="ml-4">
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
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Example file structure" centered />
		<v-row class="d-block d-sm-flex" justify="center">
			<v-col>
				<v-card class="pa-4" elevation="4">
					<h2 class="text-center pb-4">Takes in</h2>
					<v-treeview
						:items="inputItems"
						item-key="title"
						class="bg-secondary"
						expand-icon="mdi-folder"
						collapse-icon="mdi-folder-open"
						density="compact"
						fluid
						open-on-click
						rounded>
						<template #prepend="{ item }">
							<v-icon v-if="!(item.file === 'folder' && item.children?.length)">
								{{ fileIcons[item.file as FileType] }}
							</v-icon>
						</template>
					</v-treeview>
				</v-card>
			</v-col>
			<v-col>
				<v-card class="pa-4" elevation="4">
					<h2 class="text-center pb-4">Returns</h2>
					<v-treeview
						:items="outputItems"
						item-key="title"
						class="bg-secondary"
						expand-icon="mdi-folder"
						collapse-icon="mdi-folder-open"
						density="compact"
						fluid
						open-on-click
						rounded>
						<template #prepend="{ item }">
							<v-icon v-if="!(item.file === 'folder' && item.children?.length)">
								{{ fileIcons[item.file as FileType] }}
							</v-icon>
						</template>
					</v-treeview>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
	<TableOfContents />
</template>

<script setup lang="ts">
import { fileIcons } from '@/constants/fileIcons'
import { inputItems, outputItems } from '@/constants/fileOrganizer'
import { FileType } from '@/enums/fileType'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const repo = 'toomas633/file-organizer'
</script>
