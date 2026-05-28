<template>
	<v-container>
		<h1 class="text-center d-flex justify-center align-items-center">
			MeshForge
		</h1>
		<StatsAndChips hide-langs :repo="repo" />
		<p :class="!isMobile ? 'text-center' : ''">
			Convert STL and OBJ mesh files into clean STEP solids — entirely in the
			browser, with a real-time progress feed and an interactive 3D preview.
		</p>
		<v-row class="d-block d-sm-flex" justify="center">
			<v-col class="align-content-space-around mt-3">
				<StatsAndChips hide-chips :repo="repo" />
			</v-col>
			<v-col class="align-content-space-around" lg="2" md="3" sm="4" xl="1">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/MeshForge"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<LinkableTitle h1 title="Features" centered />
		<IconList :items="features" />
		<LinkableTitle h1 title="Quick Start" centered />
		No local Python or Node.js installation required.
		<CodeBlock :code="dockerPullCode" />
		Then open
		<LinkComponent href="http://localhost:5000" text="http://localhost:5000" />
		in your browser.
		<br /><br />
		Job directories are ephemeral by default. To persist converted files across
		container restarts:
		<CodeBlock :code="dockerPersistCode" />
		<LinkableTitle h1 title="Supported Formats" centered />
		<v-data-table
			:headers="formatHeaders"
			:items="supportedFormats"
			hide-default-footer
			class="rounded mt-3" />
		<LinkableTitle h1 title="Using the Interface" centered />
		<ol>
			<li>Click <b>Add Files</b> or drag files directly onto the page.</li>
			<li>
				The upload modal accepts multiple files at once; drag-and-drop also
				works.
			</li>
			<li>
				Each file becomes a job card showing live log output as the pipeline
				runs.
			</li>
			<li>
				When a job finishes, click its card to open the 3D viewer, or click
				<b>Download</b> to save the STEP file.
			</li>
			<li>
				Use the <b>Download All</b> button (appears once at least one job is
				done) to grab a zip of every completed output.
			</li>
			<li>
				Navigating away or closing the tab cancels any queued jobs
				automatically.
			</li>
		</ol>
		<LinkableTitle h1 title="Pipeline Details" centered />
		The conversion runs serially on a background thread so the server stays
		responsive during heavy mesh work.
		<br /><br />
		<b>Stage 1 — PyMeshLab cleanup</b>
		<ul>
			<li>Removes duplicate vertices and faces, unreferenced vertices</li>
			<li>Repairs non-manifold edges and vertices</li>
			<li>
				Merges close vertices (<InlineCode code="MERGE_THRESHOLD = 0.0001" />)
			</li>
			<li>Re-orients normals coherently</li>
			<li>
				Decimates meshes over 100&nbsp;000 faces to keep STEP file size
				manageable
			</li>
			<li>Applies one pass of Laplacian smoothing</li>
		</ul>
		<br />
		<b>Stage 2 — pythonocc-core solid</b>
		<ul>
			<li>
				Sews the cleaned triangle soup into a closed shell (<InlineCode
					code="TOLERANCE = 0.01 mm" />)
			</li>
			<li>Promotes the shell to a solid and fixes orientation</li>
			<li>
				Runs three rounds of
				<InlineCode code="ShapeUpgrade_UnifySameDomain" /> to merge coplanar
				faces
			</li>
			<li>Validates geometry with <InlineCode code="BRepCheck_Analyzer" /></li>
			<li>Exports as ISO 10303 STEP AP214</li>
		</ul>
	</v-container>
	<TableOfContents />
</template>

<script setup lang="ts">
import type { IconListItem } from '@/types/iconList'
import { isMobile } from '@basitcodeenv/vue3-device-detect'
import useIconListMixin from '@/helpers/iconListMixin'

const { createPreset } = useIconListMixin()

const repo = 'toomas633/meshforge'

const meshForgePresets = {
	upload: createPreset({ icon: 'mdi-upload', color: '#1e88e5' }),
	progress: createPreset({ icon: 'mdi-progress-clock', color: '#43a047' }),
	preview: createPreset({ icon: 'mdi-rotate-3d', color: '#fb8c00' }),
	download: createPreset({ icon: 'mdi-download-multiple', color: '#00acc1' }),
	theme: createPreset({ icon: 'mdi-theme-light-dark', color: '#8e24aa' }),
	pipeline: createPreset({ icon: 'mdi-pipe', color: '#e53935' }),
}

const features: IconListItem[] = [
	meshForgePresets.upload({
		title: 'Drag-and-drop Upload',
		text: 'Drop one or more STL / OBJ files to queue them all at once.',
	}),
	meshForgePresets.progress({
		title: 'Real-time Progress',
		text: 'Server-sent events stream each pipeline stage as it runs.',
	}),
	meshForgePresets.preview({
		title: '3D Preview',
		text: 'Interactive Three.js viewer opens when a job completes; click any finished job to inspect it.',
	}),
	meshForgePresets.download({
		title: 'Batch Download',
		text: 'Download individual STEP files or zip all completed jobs in one click.',
	}),
	meshForgePresets.theme({
		title: 'Dark / Light Theme',
		text: 'Persisted across sessions.',
	}),
	meshForgePresets.pipeline({
		title: 'Two-stage Pipeline',
		text: 'PyMeshLab cleanup followed by pythonocc-core solid generation with geometry validation.',
	}),
]

const dockerPullCode = `docker pull ghcr.io/toomas633/meshforge:latest
docker run --rm -p 5000:5000 ghcr.io/toomas633/meshforge:latest`

const dockerPersistCode = `docker run --rm -p 5000:5000 \\
  -v meshforge_jobs:/app/jobs \\
  ghcr.io/toomas633/meshforge:latest`

const formatHeaders = [
	{ title: 'Input', key: 'input' },
	{ title: 'Output', key: 'output' },
]

const supportedFormats = [
	{ input: '.stl', output: '.step' },
	{ input: '.obj', output: '.step' },
]
</script>
