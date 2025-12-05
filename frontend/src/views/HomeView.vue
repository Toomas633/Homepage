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
						title="Junior DevOps Engineer"
						subtitle="Angular, Vue, Spring, k8s">
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
							size="100"
							text="GitHub"
							href="https://github.com/Toomas633/"
							icon="mdi-github" />
					</v-col>
					<v-col>
						<ButtonCard
							size="100"
							text="Thingiverse"
							href="https://www.thingiverse.com/toomas633/designs"
							icon="mdi-rocket-launch"
							icon-color="blue" />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<div
			v-for="item in items"
			:key="item.title"
			class="d-flex flex-wrap align-center pa-1">
			<h1 class="mr-2">{{ item.title }}:</h1>
			<a
				v-for="icon in item.icons"
				:key="icon.alt"
				:href="icon.href"
				target="_blank"
				rel="noopener">
				<v-img
					class="ma-2"
					:src="isDark && icon.srcDark ? icon.srcDark : icon.src"
					:alt="icon.alt"
					:height="icon.height ?? 45"
					:width="icon.width ?? 45" />
			</a>
			<v-divider color="primary" class="border-opacity-100" />
		</div>
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

const items: { title: string; icons: LinkImage[] }[] = [
	{
		title: 'Programming',
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
		icons: [
			{
				href: 'https://www.nginx.com/',
				src: Nginx,
				srcDark: NginxDark,
				alt: 'Nginx',
				width: '113',
			},
			{ href: 'https://spring.io/', src: Spring, alt: 'Spring' },
			{
				href: 'https://nodejs.org/',
				src: NodeJS,
				srcDark: NodeJsDark,
				alt: 'Node.js',
				width: '73',
			},
		],
	},
	{
		title: 'Frontend',
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
		icons: [
			{ href: 'https://aws.amazon.com/', src: AWS, alt: 'AWS', width: '74' },
			{
				href: 'https://www.oracle.com/cloud/',
				src: OracleCloud,
				alt: 'Oracle Cloud',
				width: '85',
			},
		],
	},
	{
		title: 'Visualization',
		icons: [{ href: 'https://grafana.com/', src: Grafana, alt: 'Grafana' }],
	},
	{
		title: 'Hardware',
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
</style>
