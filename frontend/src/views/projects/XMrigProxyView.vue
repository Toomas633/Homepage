<template>
	<v-container>
		<h1 class="text-center">XMrig Proxy</h1>
		<StatsAndChips :repo="repo" hide-langs />
		<p :class="!isMobile ? 'text-center' : ''">
			Simple ubuntu docker image with the latest XMRig Proxy cloned from
			<LinkComponent
				href="https://github.com/xmrig/xmrig-proxy"
				text="official xmrig repo" />
			and a statistics overview ui.
		</p>
		<v-row class="d-block d-sm-flex my-1" justify="center">
			<v-col>
				<StatsAndChips :repo="repo" hide-chips />
			</v-col>
			<v-col sm="3" md="3" lg="2">
				<ButtonCard
					text="GitHub"
					href="https://github.com/Toomas633/XMRig-Proxy"
					icon="mdi-github" />
			</v-col>
		</v-row>
		<v-img
			:src="Image"
			style="cursor: zoom-in"
			title="screenshot"
			alt="screenshot"
			@click="openImageInNewTab(Image)" />
		<LinkableTitle h1 title="Running" centered />
		<p>
			Run the Docker container with the following command, passing the necessary
			environment variables:
		</p>
		<CodeBlock :code="dockerCode" />
		<LinkableTitle h2 title="Dockercompose" />
		<p class="mb-2">Or with <InlineCode code="docker-compose.yml" />:</p>
		<CodeBlock :code="dockerCompose" />
		<p class="mt-2">
			Replace <InlineCode code="YOUR_MINING_POOL_URL" />,
			<InlineCode code="YOUR_WALLET_ADDRESS" />, <InlineCode code="x" />, and
			<InlineCode code="YOUR_ACCESS_TOKEN" /> with your actual values. Generate
			<InlineCode code="ACCESS_TOKEN" /> with
			<InlineCode code="openssl rand -hex 16" /> or random string. <br />
			Port 8080 is optional if you want direct access to XMRig proxy http api.
		</p>
		<LinkableTitle h2 title="Env variables" />
		<v-data-table :items="items" hide-default-footer class="rounded" />
	</v-container>
	<TableOfContents />
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect'
import Image from '@/assets/images/xmrig-proxy/image.png'
import useImageMixin from '@/helpers/imageMixin'

const { openImageInNewTab } = useImageMixin()

const repo = 'toomas633/xmrig-proxy'

const dockerCode = `docker pull toomas633/xmrig-proxy:latest && \
docker run -d -p 3333:3333 -p 8080:8080 -p 80:80\
    -e POOL_URL="YOUR_MINING_POOL_URL" \
    -e USER="YOUR_WALLET_ADDRESS" \
    -e PASS="x" \
    -e ALGO="rx/0" \
    --name xmrig-proxy toomas633/xmrig-proxy:latest
`

const dockerCompose = `version: '3.8'
services:
  xmrig-proxy:
    image: toomas633/xmrig-proxy:latest
    container_name: xmrig-proxy-container
    ports:
      - "3333:3333"
      - "80:80"
      - "8080:8080"
    environment:
      - POOL_URL=randomxmonero.auto.nicehash.com:9200
      - USER=3NPFV9ivECdSgyCXeNk4h5Gm3q1xiDRnPV.Home
      - PASS=x
      - ALGO=rx/0
    restart: unless-stopped`

const items = [
	{
		param: '-p 3333',
		default: '',
		description: 'Port 3333 used to connect miners to proxy',
	},
	{
		param: '-p 80',
		description: 'Port 80 used to serve the statistics panel',
	},
	{
		param: '-p 8080 (optional)',
		description: 'Port 8080 to access xmrig proxy http api directly if needed',
	},
	{
		param: '-e POOL_URL',
		description: 'URL or IP:Port to desired mining pool',
	},
	{
		param: '-e USER',
		description: 'Wallet address (wallet.display_name if supported by pool)',
	},
	{
		param: '-e PASS (optional)',
		default: 'x',
		description: 'Pass or display name for supported pools',
	},
	{
		param: '-e ALGO (optional)',
		default: 'rx/0',
		description: 'Mining algorithm',
	},
]
</script>
