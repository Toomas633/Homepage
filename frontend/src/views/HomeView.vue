<template>
	<v-container>
		<h1 class="text-center">About me</h1>
		<p :class="!isMobile ? 'text-center' : ''">
			I'm a hobbyist who loves robots, space, video games, tech, cars and 3D
			printing. <br />
			From early in my life, I was salvaging and repairing old electronics and
			worked with LEGO Mindstorms and Technics, Arduinos and have thus started
			making projects of my own.
		</p>
		<v-row class="mb-4 d-block d-sm-flex" justify="center">
			<v-col class="align-content-space-around">
				<v-list class="bg-transparent" density="compact">
					<v-list-item
						title="Bachelor of Science in Engineering"
						subtitle="Smart Systems and Applied Information Technology (Cyber-Physical Systems)">
						<template #prepend>
							<v-icon>mdi-school</v-icon>
						</template>
					</v-list-item>
					<v-list-item
						title="Junior Full Stack Developer"
						subtitle="Angular, Vue, Spring Boot, PostgreSQL">
						<template #prepend>
							<v-icon>mdi-briefcase</v-icon>
						</template>
					</v-list-item>
					<v-list-item subtitle="Software, Hardware (3D)">
						<template #prepend>
							<v-icon>mdi-license</v-icon>
						</template>
						<template #title>
							<LinkComponent
								href="https://www.tldrlegal.com/license/gnu-general-public-license-v3-gpl-3"
								text="GPL-3" />,
							<LinkComponent
								href="https://choosealicense.com/licenses/cern-ohl-s-2.0/#"
								text="CERN OHL v2" />
						</template>
					</v-list-item>
				</v-list>
			</v-col>
			<v-col
				class="align-content-space-around pa-0"
				sm="3"
				md="5"
				lg="4"
				xl="3">
				<v-row class="pa-0 ma-0" justify="center">
					<v-col>
						<ButtonCard
							text="GitHub"
							href="https://github.com/Toomas633/"
							icon="mdi-github" />
					</v-col>
					<v-col>
						<ButtonCard
							text="Thingiverse"
							href="https://www.thingiverse.com/toomas633/designs"
							icon="mdi-rocket-launch"
							icon-color="blue" />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<h2 class="text-center stack-title">Tech stack</h2>
		<v-row>
			<v-col
				v-for="item in items"
				:key="item.title"
				cols="12"
				md="6"
				lg="4"
				class="d-flex">
				<v-card class="stack-card" variant="flat">
					<div class="stack-head">
						<v-icon :icon="item.icon" size="18" class="stack-head-icon" />
						<h3 class="stack-head-title">{{ item.title }}</h3>
						<span class="stack-count">{{ item.icons.length }}</span>
					</div>
					<div class="stack-items">
						<a
							v-for="icon in item.icons"
							:key="icon.alt"
							class="stack-item"
							:href="icon.href"
							target="_blank"
							rel="noopener">
							<img
								class="stack-item-logo"
								:src="isDark && icon.srcDark ? icon.srcDark : icon.src"
								:alt="icon.alt"
								loading="lazy" />
							<span class="stack-item-label">{{ icon.alt }}</span>
						</a>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script setup lang="ts">
import C from '@/assets/icons/logos/c.svg'
import Java from '@/assets/icons/logos/java.svg'
import Python from '@/assets/icons/logos/python.svg'
import PHP from '@/assets/icons/logos/php.svg'
import JS from '@/assets/icons/logos/javascript.svg'
import TS from '@/assets/icons/logos/typescript.svg'
import Nginx from '@/assets/icons/logos/nginx.svg'
import NginxDark from '@/assets/icons/logos/nginx-dark.svg'
import Spring from '@/assets/icons/logos/spring.svg'
import NodeJS from '@/assets/icons/logos/nodejs.svg'
import NodeJsDark from '@/assets/icons/logos/nodejs-dark.svg'
import Vue from '@/assets/icons/logos/vue.svg'
import Vuetify from '@/assets/icons/logos/vuetify.svg'
import Angular from '@/assets/icons/logos/angular.svg'
import Sass from '@/assets/icons/logos/sass.svg'
import Wordpress from '@/assets/icons/logos/wordpress.svg'
import Bash from '@/assets/icons/logos/bash.svg'
import BashDark from '@/assets/icons/logos/bash-dark.svg'
import Docker from '@/assets/icons/logos/docker.svg'
import K3S from '@/assets/icons/logos/k3s.svg'
import Grafana from '@/assets/icons/logos/grafana.svg'
import MySQL from '@/assets/icons/logos/mysql.svg'
import SQLite from '@/assets/icons/logos/sqlite.svg'
import PostgreSQL from '@/assets/icons/logos/postgresql.svg'
import Oracle from '@/assets/icons/logos/oracle.svg'
import AWS from '@/assets/icons/logos/aws.svg'
import OracleCloud from '@/assets/icons/logos/oracle-cloud.svg'
import Blender from '@/assets/icons/logos/blender.svg'
import SketchUp from '@/assets/icons/logos/sketchup.svg'
import SolidEdge from '@/assets/icons/logos/solid-edge.svg'
import Cura from '@/assets/icons/logos/cura.svg'
import RPi from '@/assets/icons/logos/raspberry-pi.svg'
import Arduino from '@/assets/icons/logos/arduino.svg'
import Windows from '@/assets/icons/logos/windows.svg'
import Ubuntu from '@/assets/icons/logos/ubuntu.svg'
import Git from '@/assets/icons/logos/git.svg'
import Maven from '@/assets/icons/logos/maven.svg'
import Gradle from '@/assets/icons/logos/gradle.svg'
import type { LinkImage } from '@/types/image'
import useThemeMixin from '@/helpers/themeMixin'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const { isDark } = useThemeMixin()

const items: { title: string; icon: string; icons: LinkImage[] }[] = [
	{
		title: 'Programming',
		icon: 'mdi-code-braces',
		icons: [
			{ href: 'https://www.cprogramming.com/', src: C, alt: 'C' },
			{ href: 'https://www.java.com/', src: Java, alt: 'Java' },
			{ href: 'https://www.python.org/', src: Python, alt: 'Python' },
			{ href: 'https://www.php.net/', src: PHP, alt: 'PHP' },
			{ href: 'https://www.javascript.com/', src: JS, alt: 'JavaScript' },
			{ href: 'https://www.typescriptlang.org/', src: TS, alt: 'TypeScript' },
		],
	},
	{
		title: 'Backend',
		icon: 'mdi-server',
		icons: [
			{
				href: 'https://www.nginx.com/',
				src: Nginx,
				srcDark: NginxDark,
				alt: 'Nginx',
			},
			{ href: 'https://spring.io/', src: Spring, alt: 'Spring' },
			{
				href: 'https://nodejs.org/',
				src: NodeJS,
				srcDark: NodeJsDark,
				alt: 'Node.js',
			},
		],
	},
	{
		title: 'Frontend',
		icon: 'mdi-monitor-dashboard',
		icons: [
			{ href: 'https://vuejs.org/', src: Vue, alt: 'Vue' },
			{ href: 'https://vuetifyjs.com/', src: Vuetify, alt: 'Vuetify' },
			{ href: 'https://angular.io/', src: Angular, alt: 'Angular' },
			{ href: 'https://sass-lang.com/', src: Sass, alt: 'Sass' },
			{ href: 'https://wordpress.com/', src: Wordpress, alt: 'Wordpress' },
		],
	},
	{
		title: 'Devops',
		icon: 'mdi-infinity',
		icons: [
			{
				href: 'https://www.gnu.org/software/bash/',
				src: Bash,
				srcDark: BashDark,
				alt: 'Bash',
			},
			{ href: 'https://www.docker.com/', src: Docker, alt: 'Docker' },
			{ href: 'https://k3s.io/', src: K3S, alt: 'K3S' },
		],
	},
	{
		title: '3D',
		icon: 'mdi-cube-outline',
		icons: [
			{ href: 'https://www.blender.org/', src: Blender, alt: 'Blender' },
			{ href: 'https://www.sketchup.com/', src: SketchUp, alt: 'SketchUp' },
			{
				href: 'https://solidedge.siemens.com/en/',
				src: SolidEdge,
				alt: 'Solid Edge',
			},
			{
				href: 'https://ultimaker.com/software/ultimaker-cura',
				src: Cura,
				alt: 'Cura',
			},
		],
	},
	{
		title: 'Databases',
		icon: 'mdi-database',
		icons: [
			{ href: 'https://www.mysql.com/', src: MySQL, alt: 'MySQL' },
			{ href: 'https://sqlite.org/index.html', src: SQLite, alt: 'SQLite3' },
			{
				href: 'https://www.postgresql.org/',
				src: PostgreSQL,
				alt: 'PostgreSQL',
			},
			{ href: 'https://www.oracle.com/database/', src: Oracle, alt: 'Oracle' },
		],
	},
	{
		title: 'Cloud',
		icon: 'mdi-cloud-outline',
		icons: [
			{ href: 'https://aws.amazon.com/', src: AWS, alt: 'AWS' },
			{
				href: 'https://www.oracle.com/cloud/',
				src: OracleCloud,
				alt: 'Oracle Cloud',
			},
		],
	},
	{
		title: 'Visualization',
		icon: 'mdi-chart-line',
		icons: [{ href: 'https://grafana.com/', src: Grafana, alt: 'Grafana' }],
	},
	{
		title: 'Hardware',
		icon: 'mdi-chip',
		icons: [
			{
				href: 'https://www.raspberrypi.org/',
				src: RPi,
				alt: 'Raspberry Pi',
			},
			{ href: 'https://www.arduino.cc/', src: Arduino, alt: 'Arduino' },
		],
	},
	{
		title: 'Op systems',
		icon: 'mdi-laptop',
		icons: [
			{
				href: 'https://www.microsoft.com/en-us/windows',
				src: Windows,
				alt: 'Windows',
			},
			{ href: 'https://ubuntu.com/', src: Ubuntu, alt: 'Ubuntu' },
		],
	},
	{
		title: 'Version control',
		icon: 'mdi-source-branch',
		icons: [
			{ href: 'https://git-scm.com/', src: Git, alt: 'Git' },
			{ href: 'https://maven.apache.org/', src: Maven, alt: 'Maven' },
			{ href: 'https://gradle.org/', src: Gradle, alt: 'Gradle' },
		],
	},
]
</script>
<style scoped lang="scss">
.mdi-school,
.mdi-briefcase,
.mdi-license {
	opacity: 1;
}

.mdi-school {
	color: sandybrown;
}

.mdi-briefcase {
	color: darkcyan;
}

.mdi-license {
	color: orange;
}

/* --------------------------------------------------------------------------
   Tech stack
   -------------------------------------------------------------------------- */

.stack-title {
	margin-block: 2rem 1.25rem;
}

.stack-card {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1rem;
	border-radius: var(--radius-lg);
	background-color: rgba(var(--v-theme-on-surface), 0.03);
	border: 0.0625rem solid var(--surface-line);
}

.stack-head {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding-bottom: 0.75rem;
	margin-bottom: 0.875rem;
	border-bottom: 0.0625rem solid var(--surface-line);
}

.stack-head-icon {
	color: rgb(var(--v-theme-primary));
}

.stack-head-title {
	flex: 1 1 auto;
	margin: 0;
	font-size: 0.8125rem;
	font-weight: 700;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.stack-count {
	padding: 0.0625rem 0.4375rem;
	border-radius: var(--radius-pill);
	background-color: rgba(var(--v-theme-primary), 0.12);
	color: rgb(var(--v-theme-primary));
	font-size: 0.6875rem;
	font-weight: 700;
}

.stack-items {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(5.25rem, 1fr));
	gap: 0.5rem;
}

.stack-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 0.625rem 0.375rem;
	border-radius: var(--radius-md);
	background-color: rgba(var(--v-theme-on-surface), 0.04);
	border: 0.0625rem solid transparent;
	color: inherit;
	text-decoration: none;
	transition:
		background-color var(--speed-fast) var(--ease-out),
		border-color var(--speed-fast) var(--ease-out),
		translate var(--speed-fast) var(--ease-out);
}

.stack-item:hover {
	background-color: rgba(var(--v-theme-primary), 0.1);
	border-color: rgba(var(--v-theme-primary), 0.35);
	translate: 0 -0.125rem;
}

.stack-item-logo {
	width: 100%;
	height: 2rem;
	object-fit: contain;
}

.stack-item-label {
	font-size: 0.6875rem;
	line-height: 1.2;
	text-align: center;
	opacity: 0.7;
	transition: opacity var(--speed-fast) var(--ease-out);
}

.stack-item:hover .stack-item-label {
	opacity: 1;
}
</style>
