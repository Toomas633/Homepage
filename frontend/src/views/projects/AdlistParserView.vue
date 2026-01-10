<template>
	<v-container>
		<h1 class="text-center d-flex justify-center align-items-center">
			Adlist Parser
		</h1>
		<StatsAndChips hide-langs :repo="repo" />
		<p :class="!isMobile ? 'text-center' : ''">
			A high-performance Python utility that fetches and merges multiple adlists
			into domain-only output for DNS blockers like Pi-hole, AdGuard, and
			similar DNS filtering solutions.
		</p>
		<v-row class="d-block d-sm-flex" justify="center">
			<v-col class="align-content-space-around mt-3">
				<StatsAndChips hide-chips :repo="repo" />
			</v-col>
			<v-col class="align-content-space-around" lg="2" md="3" sm="4" xl="1">
				<ButtonCard
					size="100"
					text="GitHub"
					href="https://github.com/Toomas633/Adlist-Parser"
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
				<b>Fast Concurrent Processing:</b>
				Processes 1.6M+ entries from 50+ sources in ~50-60 seconds.
			</li>
			<li>
				<b>Standard Library Only:</b>
				Uses only Python standard library (3.8+).
			</li>
			<li>
				<b>Dual Output:</b>
				Generates both adlists and whitelists simultaneously.
			</li>
			<li>
				<b>ABP + Pi-hole Support:</b>
				Normalizes ABP rules and converts simple Pi-hole regex patterns.
			</li>
			<li>
				<b>Intelligent Separation:</b>
				Automatically separates blocklist and whitelist entries.
			</li>
			<li>
				<b>Redundancy Analysis:</b>
				Detects duplicates and overlap across sources.
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Installation (optional)" centered />
		You can run from a checkout (above) or install locally to get the
		<InlineCode code="adlist-parser" /> command:
		<CodeBlock
			code="python -m pip install -e .
adlist-parser" />
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Configuration" centered />
		Configure your sources in JSON files:
		<ul class="ml-4">
			<li>
				<InlineCode code="data/adlists.json" /> Blocklist sources:
				<CodeBlock :code="adlistsExample" />
			</li>
			<li class="mt-4">
				<InlineCode code="data/whitelists.json" /> Whitelist sources:
				<CodeBlock :code="whitelistsExample" />
			</li>
		</ul>
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h2 title="Source Types" />
		<ul class="ml-4">
			<li>
				<b>URLs:</b>
				HTTP/HTTPS links to remote lists
			</li>
			<li>
				<b>Local Files:</b>
				Relative paths to files in the <InlineCode code="data/" /> directory
			</li>
			<li>
				<b>Mixed format:</b>
				Each source can contain domains, wildcards, regex patterns, or Pi-hole
				entries
			</li>
		</ul>
		Notes:
		<ul class="ml-4">
			<li>
				<b>Path resolution:</b> relative paths inside the JSON files are
				resolved relative to the JSON file location (not the CWD).
			</li>
			<li>
				<b>Accepted keys:</b> both files accept any of
				<InlineCode code="lists" />, <InlineCode code="urls" />,
				<InlineCode code="adlists" /> or <InlineCode code="sources" /> for
				compatibility; they are merged.
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Output Format" centered />
		<LinkableTitle h2 title="Supported Input Formats" />
		<ul class="ml-4">
			<li>
				<b>Plain domains:</b>
				<InlineCode code="example.com" />
			</li>
			<li>
				<b>Wildcards:</b>
				<InlineCode code="*.example.com" />
			</li>
			<li>
				<b>Pi-hole regex:</b>
				<InlineCode :code="piHoleRegexExample" />
			</li>
			<li>
				<b>AdBlock patterns:</b>
				<InlineCode code="/pattern/flags" />
			</li>
			<li>
				<b>Host file entries:</b>
				<InlineCode code="0.0.0.0 example.com" />
			</li>
			<li>
				<b>Comments:</b>
				Lines starting with <InlineCode code="#" />, <InlineCode code="!" />,
				<InlineCode code="//" />, or <InlineCode code=";" />
			</li>
		</ul>
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h2 title="Output Processing" />
		<ol class="ml-4">
			<li>
				<b>Domain Extraction:</b>
				Extracts clean domains from various host file formats.
			</li>
			<li>
				<b>Wildcard Handling:</b>
				<InlineCode code="*.domain.com" /> is preserved as a domain token
				(wildcard not expanded). In the final domain output the leading
				<InlineCode code="*." /> is stripped to
				<InlineCode code="domain.com" />.
			</li>
			<li>
				<b>ABP Normalization:</b>
				Fixes broken ABP patterns automatically:
				<CodeBlock :code="abpNormalizationExamples" />
			</li>
			<li>
				<b>ABP Conversion:</b>
				Pi-hole regex patterns convert to <InlineCode code="||domain^" /> format
				when possible.
			</li>
			<li>
				<b>Blocklist/Whitelist Separation:</b>
				Automatically moves <InlineCode code="@@||" /> exception entries from
				blocklist to whitelist.
			</li>
			<li>
				<b>Domain Validation:</b>
				Validates and removes invalid domain entries during post-processing.
			</li>
			<li>
				<b>Regex Handling:</b>
				Complex regexes that can't convert to ABP are discarded (pipeline
				doesn't crash).
			</li>
			<li>
				<b>Deduplication:</b>
				Preserves first-seen order during normalization; final outputs are
				sorted case-insensitively during post-processing.
			</li>
			<li>
				<b>Comment Filtering:</b>
				Strips whole-line and inline comments (<InlineCode code="#" />,
				<InlineCode code="!" />, <InlineCode code="//" />,
				<InlineCode code=";" />).
			</li>
			<li>
				<b>HTML Filtering:</b>
				Removes HTML tags and attributes from lists.
			</li>
			<li>
				<b>Error Resilience:</b>
				Failed fetches logged and filtered during normalization.
			</li>
			<li>
				<b>Adlist merge:</b>
				Adlist pipeline merges with prior
				<InlineCode code="output/adlist.txt" />
				before writing to preserve entries across transient source failures
				(whitelist writes directly).
			</li>
		</ol>
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h2 title="Determinism and file format" />
		<ul class="ml-4">
			<li>Outputs use LF-only line endings.</li>
			<li>
				Sorting is deterministic and case-insensitive; deduplication is
				case-insensitive and whitespace-trimmed.
			</li>
			<li>
				Headers are regenerated during post-processing (don’t hand-edit
				outputs).
			</li>
		</ul>
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h2 title="Output file header (sample)" />
		<CodeBlock :code="outputHeaderSample" />
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Performance" centered />
		<ul class="ml-4">
			<li>
				<b>Concurrency:</b>
				Fetches multiple sources simultaneously (max 16 workers).
			</li>
			<li>
				<b>Async Processing:</b>
				Adlists and whitelists processed in parallel.
			</li>
			<li>
				<b>Memory Efficient:</b>
				Line-by-line processing for large datasets.
			</li>
			<li>
				<b>Real-world Scale:</b>
				Tested with 1.6M+ entries from 50+ sources.
			</li>
		</ul>
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h2 title="Tuning" />
		<ul class="ml-4">
			<li>
				<b>Concurrency:</b>
				Network fetching uses up to 16 workers (see
				<InlineCode code="adparser/fetcher.py" />).
			</li>
			<li>
				<b>I/O:</b>
				Most heavy I/O runs off the event loop using
				<InlineCode code="asyncio.to_thread()" />; disk speed can impact total
				time.
			</li>
			<li>
				<b>Output size:</b>
				<InlineCode code="output/adlist.txt" /> can reach ~1.6–1.7M lines
				depending on sources.
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="How It Works" centered />
		Two concurrent pipelines run via <InlineCode code="asyncio.gather()" />:
		<ol class="ml-4">
			<li>
				<b>Fetch Sources</b>
				→ Download remote lists and read local files.
			</li>
			<li>
				<b>Parse</b>
				→ Extract domains and rules from multiple formats.
			</li>
			<li>
				<b>Normalize</b>
				→ Fix common ABP issues and convert simple Pi-hole regex patterns when
				possible.
			</li>
			<li>
				<b>Separate + Deduplicate</b>
				→ Split blocklist vs whitelist and remove duplicates.
			</li>
			<li>
				<b>Write Output</b>
				→ Generate <InlineCode code="output/adlist.txt" /> and
				<InlineCode code="output/whitelist.txt" /> with headers.
			</li>
			<li>
				<b>Redundancy Report</b>
				→ Analyze duplicates and overlaps across sources.
			</li>
		</ol>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Architecture" centered />
		<CodeBlock :code="architectureTree" />
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h2 title="Design Principles" />
		<ul class="ml-4">
			<li>
				<b>Error Isolation:</b>
				Failed sources do not crash the pipeline.
			</li>
			<li>
				<b>Async I/O:</b>
				Heavy operations run in a thread pool via
				<InlineCode code="asyncio.to_thread()" />.
			</li>
			<li>
				<b>Determinism:</b>
				Sorting and headers are regenerated consistently on each run.
			</li>
		</ul>
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h1 title="Redundancy Analysis" centered color="primary" />
		The parser includes built-in redundancy detection to help optimize your
		source lists.
		<v-divider class="mt-4 mb-2 border-opacity-100" thickness="2" />
		<LinkableTitle h2 title="Features" />
		<ul class="ml-4">
			<li>
				<b>Duplicate Detection:</b>
				Identifies sources with identical content.
			</li>
			<li>
				<b>Local File Analysis:</b>
				Shows which entries in local files are already covered by remote
				sources.
			</li>
			<li>
				<b>Removal Suggestions:</b>
				Lists first 20 redundant entries with count of remaining.
			</li>
		</ul>
		<LinkableTitle h2 title="Example Output" />
		<CodeBlock :code="redundancyExample" />
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Input Format Examples" centered />
		<v-data-table
			:items="inputFormatExamples"
			hide-default-footer
			class="rounded" />
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Troubleshooting" centered />
		<ul class="ml-4">
			<li>
				<b>Network Errors:</b>
				Failed sources are listed as "UNAVAILABLE SOURCES" in the final report
				with <InlineCode code="🌐" /> (remote) or
				<InlineCode code="📄" /> (local) indicators.
			</li>
			<li>
				<b>Proxy Issues:</b>
				Configure system proxy settings or mirror remote sources locally in
				<InlineCode code="data/" /> and update JSON configs.
			</li>
			<li>
				<b>Large Files:</b>
				<InlineCode code="output/adlist.txt" /> can be 30MB+; use command-line
				tools like <InlineCode code="grep" /> and
				<InlineCode code="wc -l" /> for inspection.
			</li>
			<li>
				<b>Slow Performance:</b>
				Check network speed; adjust worker count in
				<InlineCode code="adparser/fetcher.py" /> (default: 16).
			</li>
			<li>
				<b>Memory Usage:</b>
				Line-by-line processing keeps memory footprint low even with 1.6M+
				lines.
			</li>
		</ul>
		<LinkableTitle h2 title="FAQ" />
		<ul class="ml-4">
			<li>
				<b>
					Why are element-hiding rules (e.g., <InlineCode code="##" />,
					<InlineCode code="#@?#" />) missing?
				</b>
				<br />
				This tool targets DNS blocklists. Element-hiding is cosmetic
				(browser-side), so such rules are dropped during normalization.
			</li>
			<li class="mt-2">
				<b>Why do some regex rules disappear?</b>
				<br />
				Only simple, anchored Pi-hole patterns are converted to ABP (<InlineCode
					code="||domain^" />). Complex/JS-like regex is discarded for safety
				and DNS relevance.
			</li>
			<li class="mt-2">
				<b>
					My local file entries are already covered by remotes—how do I find
					them?
				</b>
				<br />
				Check the redundancy section at the end of the run; it lists duplicates
				and local entries already provided by remote sources.
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Example Output" centered />
		<CodeBlock :code="exampleOutput" />
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Requirements" centered />
		<ul class="ml-4">
			<li>Python 3.8 or higher</li>
			<li>No external dependencies (uses only standard library)</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Use Cases" centered />
		<ul class="ml-4">
			<li>
				<b>Pi-hole:</b>
				Use <InlineCode code="output/adlist.txt" /> as a blocklist and
				<InlineCode code="output/whitelist.txt" /> as an allowlist.
			</li>
			<li>
				<b>AdGuard Home:</b>
				Import both files as custom filtering rules.
			</li>
			<li>
				<b>DNS Filtering:</b>
				Any DNS-based ad blocker that supports domain lists.
			</li>
			<li>
				<b>Network Security:</b>
				Corporate firewall domain blocking lists.
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 title="Acknowledgments" centered />
		<ul class="ml-4">
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
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const repo = 'toomas633/adlist-parser'

const adlistsExample = `{
	"lists": ["blacklist.txt", "old_adlist.txt"],
	"urls": [
		"https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
		"https://adaway.org/hosts.txt",
		"https://v.firebog.net/hosts/AdguardDNS.txt"
	]
}`

const whitelistsExample = `{
	"lists": ["whitelist.txt"],
	"urls": [
		"https://raw.githubusercontent.com/hagezi/dns-blocklists/main/domains/whitelist-referral.txt"
	]
}`

const outputHeaderSample = `# Adlist - Generated by Adlist-Parser
# https://github.com/Toomas633/Adlist-Parser
#
# Created/modified: 2026-01-10 00:00:00 UTC
# Total entries: 1,684,272
# Domains: 400,527
# ABP-style rules: 1,283,745
# Sources processed: 50
#
# This file is automatically generated. Do not edit manually.
# To update, run: adlist-parser or python -m adparser`

const abpNormalizationExamples = `- ||*cdn.domain.com^ → ||*.cdn.domain.com^ (missing dot after wildcard)
- ||app.*.adjust.com^ → ||*.adjust.com^ (wildcard-only label removed)
- ||domain.google.*^ → ||domain.google^ (wildcard TLD removed - not supported)
- -domain.com^ → ||-domain.com^ (adds missing || prefix)
- @@|domain.com^| → @@||domain.com^ (fixes single pipe + trailing pipe)`

const architectureTree = `adparser/cli.py           # Main orchestrator with async/await
├── adparser/io.py        # JSON parsing, path resolution, file I/O
├── adparser/fetcher.py   # Concurrent HTTP fetching (ThreadPoolExecutor)
├── adparser/content.py   # Domain extraction, normalization, regex conversion
├── adparser/models.py    # Source descriptor dataclass (URL vs local files)
├── adparser/status.py    # Progress spinners and terminal UI updates
├── adparser/reporting.py # Results summary with emoji formatting
├── adparser/redundancy.py# Duplicate detection and overlap analysis
└── adparser/constants.py # File path constants`

const redundancyExample = `🔁 Duplicate sources (identical content): 2 groups
├─ 🌐 https://example.com/list1.txt
└─ 🌐 https://example.com/list2.txt
💡 Tip: Keep one source from this group, remove the others

📄 Local file redundancy analysis:
• blacklist.txt: 150/200 entries (75.0%) already in remote sources`

const piHoleRegexExample = String.raw`(\\.|^)example\\.com$`.replaceAll(
	'\\\\',
	'\\'
)

const inputFormatExamples = [
	{
		inputFormat: 'example.com',
		processingResult: '→ example.com (domain)',
		notes: 'Plain domain preserved',
	},
	{
		inputFormat: '*.example.com',
		processingResult: '→ ||*.example.com^ (ABP rule)',
		notes: 'Wildcard converted to ABP',
	},
	{
		inputFormat: '0.0.0.0 example.com',
		processingResult: '→ example.com (domain)',
		notes: 'Host file format extracted',
	},
	{
		inputFormat: piHoleRegexExample,
		processingResult: '→ ||example.com^ (ABP rule)',
		notes: 'Pi-hole regex converted',
	},
	{
		inputFormat: '/ads?/',
		processingResult: '→ ABP rule or discarded',
		notes: 'Converted if simple, discarded if complex',
	},
	{
		inputFormat: '# Comment line',
		processingResult: '→ filtered',
		notes: 'Comment removed',
	},
	{
		inputFormat: 'domain.com # inline',
		processingResult: '→ domain.com',
		notes: 'Inline comment stripped',
	},
	{
		inputFormat: '<div>html</div>',
		processingResult: '→ filtered',
		notes: 'HTML tags removed',
	},
	{
		inputFormat: '@@||exception.com^',
		processingResult: '→ moved to whitelist as ||exception.com^',
		notes: 'Exception rule separated',
	},
	{
		inputFormat: '||*cdn.example.com^',
		processingResult: '→ ||*.cdn.example.com^',
		notes: 'Malformed ABP pattern normalized',
	},
]

const exampleOutput = `🚀 Starting Adlist-Parser...
⚡ Processing adlists and whitelists concurrently...

⚡ Adlist: Fetching content... |/-\\ [48/50 (96%)]
⚡ Whitelist: Processing domains...

Adlist: ✅ Complete - 1684272 entries (400527 domains, 1283745 ABP rules)
Whitelist: ✅ Complete - 2337 entries (1346 domains, 991 ABP rules)

=== Adlists redundancy analysis ===
Analyzed 50 sources.
✅ No redundancy issues detected

============================================================
🎉 ALL PROCESSING COMPLETED IN 53.16 SECONDS! 🎉
============================================================
📊 RESULTS SUMMARY:
┌──────────────────────────────────────────────────────────┐
│ 🛡️  ADLIST:    50 sources → 1684272 entries              │
│   📝 Domains:  400527 | ABP rules: 1283745               │
├──────────────────────────────────────────────────────────┤
│ ✅ WHITELIST:  6 sources →    2337 entries               │
│   📝 Domains:    1346 | ABP rules:     991               │
├──────────────────────────────────────────────────────────┤
│ 📁 Output files:                                         │
│   • output/adlist.txt                                    │
│   • output/whitelist.txt                                 │
└──────────────────────────────────────────────────────────┘`
</script>
