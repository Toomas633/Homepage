<template>
	<v-container>
		<h1 class="text-center d-flex justify-center align-items-center">
			Adlist Parser
		</h1>
		<StatsAndChips hide-langs :repo="repo" />
		<p :class="!isMobile ? 'text-center' : ''">
			Fetches and merges 50+ community adlists into two normalized output files
			for DNS blockers like Pi-hole, AdGuard Home, and similar solutions.
			Updated periodically; just subscribe to the raw file URLs.
		</p>
		<v-row class="d-block d-sm-flex" justify="center">
			<v-col class="align-content-space-around mt-3">
				<StatsAndChips hide-chips :repo="repo" />
			</v-col>
			<v-col class="align-content-space-around" lg="2" md="3" sm="4" xl="1">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/Adlist-Parser"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<LinkableTitle h1 title="Output Files" centered />
		Subscribe to these raw URLs directly in your DNS blocker — no cloning or
		running anything required:
		<v-data-table
			:headers="outputFileHeaders"
			:items="outputFiles"
			hide-default-footer
			class="rounded mt-3">
			<template #[`item.url`]="{ value }">
				<LinkComponent :href="value" />
			</template>
		</v-data-table>
		<LinkableTitle h1 title="Using with Pi-hole" centered />
		<ol>
			<li>
				Open the Pi-hole admin panel →
				<b>Group Management → Adlists</b>
			</li>
			<li>Paste the adlist URL and click <b>Add</b></li>
			<li>Go to <b>Tools → Update Gravity</b> to pull the new entries</li>
		</ol>
		To add the whitelist:
		<ol>
			<li>Go to <b>Whitelist</b> and add the whitelist URL, or</li>
			<li>
				Import it via the CLI:
				<InlineCode code="pihole -w --regex-file &lt;path&gt;" />
			</li>
		</ol>
		<LinkableTitle h1 title="Using with AdGuard Home" centered />
		<ol>
			<li>
				Open AdGuard Home →
				<b>Filters → DNS blocklists → Add blocklist → Add a custom list</b>
			</li>
			<li>Paste the adlist URL and confirm</li>
			<li>
				For the whitelist:
				<b>Filters → DNS allowlists → Add allowlist → Add a custom list</b>,
				paste the whitelist URL
			</li>
		</ol>
		<LinkableTitle h1 title="Features" centered />
		<IconList :items="features" />
		<LinkableTitle h1 title="Output Format" centered />
		Each output file starts with a generated header:
		<CodeBlock :code="outputHeaderSample" />
		Entries are a mix of plain domains and ABP-style rules:
		<CodeBlock :code="outputEntryExample" />
		Both formats are recognized by Pi-hole (via gravity) and AdGuard Home.
		<LinkableTitle h1 title="FAQ" centered />
		<ul>
			<li>
				<b>
					Why are some entries ABP rules (<InlineCode code="||domain^" />)
					instead of plain domains?
				</b>
				<br />
				Wildcard and regex sources produce ABP-style rules, which Pi-hole and
				AdGuard Home both understand natively.
			</li>
			<li class="mt-2">
				<b>
					Why are element-hiding rules (<InlineCode code="##" />,
					<InlineCode code="#@#" />) missing?
				</b>
				<br />
				This tool targets DNS-level blocking. Element-hiding is browser cosmetic
				filtering and has no effect at the DNS layer.
			</li>
			<li class="mt-2">
				<b>Why do some regex entries disappear?</b>
				<br />
				Only simple, anchored Pi-hole patterns are converted to ABP. Complex
				regex is discarded — it is not DNS-safe.
			</li>
			<li class="mt-2">
				<b>How often are the files updated?</b>
				<br />
				The output files are regenerated automatically by a GitHub Actions
				workflow on a monthly schedule and whenever changes to the source lists
				(<InlineCode code="data/" />) are merged into
				<InlineCode code="main" />. Check the header timestamp in the raw file
				for the last update.
			</li>
		</ul>
		<LinkableTitle h1 title="Use Cases" centered />
		<ul>
			<li>
				<b>Pi-hole:</b>
				blocklist + allowlist
			</li>
			<li>
				<b>AdGuard Home:</b>
				DNS blocklist + DNS allowlist
			</li>
			<li>
				<b>Any DNS-based ad blocker</b>
				that accepts domain lists or ABP filter lists
			</li>
			<li>
				<b>Corporate firewall</b>
				domain blocking
			</li>
		</ul>
		<LinkableTitle h1 title="Acknowledgments" centered />
		<ul>
			<li>Built for the DNS filtering community</li>
			<li>Inspired by the need for fast, reliable adlist aggregation</li>
			<li>
				Uses high-quality sources from the community (StevenBlack, Hagezi,
				FadeMind, and others)
			</li>
		</ul>
	</v-container>
	<TableOfContents />
</template>

<script setup lang="ts">
import type { IconListItem } from '@/types/iconList'
import { isMobile } from '@basitcodeenv/vue3-device-detect'
import useIconListMixin from '@/helpers/iconListMixin'

const { createPreset } = useIconListMixin()

const repo = 'toomas633/adlist-parser'

const adlistFeaturePresets = {
	communityScale: createPreset({ icon: 'mdi-database', color: '#1e88e5' }),
	dualOutput: createPreset({ icon: 'mdi-file-multiple', color: '#1e88e5' }),
	multiFormat: createPreset({
		icon: 'mdi-filter-outline',
		color: '#fb8c00',
	}),
	intelligentSeparation: createPreset({
		icon: 'mdi-call-split',
		color: '#00acc1',
	}),
	deduplication: createPreset({
		icon: 'mdi-content-duplicate',
		color: '#e53935',
	}),
	errorResilience: createPreset({
		icon: 'mdi-shield-check',
		color: '#43a047',
	}),
}

const features: IconListItem[] = [
	adlistFeaturePresets.communityScale({
		title: 'Community Scale',
		text: '~1.6M entries merged from 50+ community sources.',
	}),
	adlistFeaturePresets.dualOutput({
		title: 'Dual Output',
		text: 'Blocklist and allowlist generated simultaneously.',
	}),
	adlistFeaturePresets.multiFormat({
		title: 'Multi-format Support',
		text: 'Handles plain domains, host file format, ABP rules, Pi-hole regex, and wildcards.',
	}),
	adlistFeaturePresets.intelligentSeparation({
		title: 'Intelligent Separation',
		text: 'Exception rules (@@||) automatically separated to the whitelist.',
	}),
	adlistFeaturePresets.deduplication({
		title: 'Deduplication & Sorting',
		text: 'Deduplication and case-insensitive sorting across all sources.',
	}),
	adlistFeaturePresets.errorResilience({
		title: 'Error Resilience',
		text: 'Failed/unavailable sources never cause missing entries — merged with previous output.',
	}),
]

const outputFileHeaders = [
	{ title: 'File', key: 'file' },
	{ title: 'Raw URL', key: 'url' },
	{ title: 'Description', key: 'description' },
]

const outputFiles = [
	{
		file: 'Adlist',
		url: 'https://raw.githubusercontent.com/Toomas633/Adlist-Parser/main/output/adlist.txt',
		description: '~1.6M blocklist entries',
	},
	{
		file: 'Whitelist',
		url: 'https://raw.githubusercontent.com/Toomas633/Adlist-Parser/main/output/whitelist.txt',
		description: '~2K allowlist entries',
	},
]

const outputHeaderSample = `# Adlist - Generated by Adlist-Parser
# https://github.com/Toomas633/Adlist-Parser
#
# Created/modified: 2025-01-01 00:00:00 UTC
# Total entries: 1,684,272
# Domains: 400,527
# ABP-style rules: 1,283,745
# Sources processed: 50
#
# This file is automatically generated. Do not edit manually.
# To update, run: adlist-parser or python -m adparser`

const outputEntryExample = `example.com
||ads.example.com^
||*.tracking.net^`
</script>
