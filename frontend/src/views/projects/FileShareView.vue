<template>
	<v-container>
		<h1 class="text-center">FileShare</h1>
		<StatsAndChips hide-langs :repo="repo" />
		<p class="text-center">
			Easy file sharing website featuring (direct) link generation and delete
			timer.
		</p>
		<v-row class="d-block d-sm-flex" justify="center">
			<v-col class="align-content-space-around pt-5">
				<StatsAndChips hide-chips :repo="repo" />
			</v-col>
			<v-col
				class="align-content-space-around pa-0"
				sm="12"
				md="5"
				lg="4"
				xl="3">
				<v-row class="pa-0 ma-0" justify="center">
					<v-col>
						<ButtonCard
							text="GitHub"
							href="https://github.com/Toomas633/FileShare"
							icon="mdi-github" />
					</v-col>
					<v-col>
						<ButtonCard
							text="Docker Hub"
							href="https://hub.docker.com/r/toomas633/fileshare"
							icon="mdi-docker"
							icon-color="blue" />
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<ImageCarosel class="mt-6" :images="images" />
		<LinkableTitle h1 centered title="Features" />
		<IconList :items="features" multicolumn />
		<LinkableTitle h1 centered title="Requirements" />
		<ul>
			<li>
				Make sure you have PHP installed on your local machine. You can check
				this by running the command <InlineCode code="php -v" /> in your
				terminal. If you don't have PHP installed, you can download it from the
				<LinkComponent
					href="https://www.php.net/"
					text="official PHP website" />.
			</li>
			<li>
				Install Python on your Windows machine if it is not already installed.
				You can download the latest version of Python from the official website
				at
				<LinkComponent href="https://www.python.org/downloads/" />.
			</li>
			<li>
				Change the values of <InlineCode code="post_max_size" /> and
				<InlineCode code="upload_max_filesize" /> in
				<InlineCode code="php.ini" /> to a desired size amount, or bigger files
				can't be uploaded (defaults are 8M and 2M in the file, so the uploaded
				file can only be of size 2MB and less). Not needed on docker image.
			</li>
			<li>
				Check that you have php-sqlite3 and php-curl installed and enabled.
				<ul>
					<li>
						On debian run
						<InlineCode code="sudo apt install php-sqlite3 php-curl" />, windows
						should have the .dll files included in the php folder
					</li>
					<li>
						Edit <InlineCode code="php.ini" /> and uncomment
						<InlineCode code="extension=pdo_sqlite" />,
						<InlineCode code="extension=sqlite3" />,
						<InlineCode code="extension=curl" /> and assign the php installation
						directory path to <InlineCode code="sqlite3.extension_dir =" />, for
						example <InlineCode code="sqlite3.extension_dir = C:\php" /> on
						windows if you put php on C drive root
					</li>
				</ul>
			</li>
			<li>
				Check that you have pytz and datetime install for python by running
				<InlineCode code="pip install pytz datetime" />
			</li>
		</ul>
		<LinkableTitle h1 centered title="Running instructions" />
		<ol>
			<li>Install PHP and Python (and add to system path on windows)</li>
			<li>
				Clone the GitHub repository to your local machine using the command
				<InlineCode
					code="git clone https://github.com/Toomas633/FileShare.git" />
				or download the zip from releases and unpack it to desired destination
			</li>
			<li>
				Start a local server to access the website in your browser. You can do
				this by running the command
				<InlineCode code="php -S localhost:8000" /> (or a different port number)
				in your terminal from the project directory
			</li>
			<li>
				For timed file delete also run <InlineCode code="cleanup.py" /> on the
				backround
			</li>
			<li>
				Access the website in your browser. Once the server is running, you can
				access the website by navigating to
				<LinkComponent href="http://localhost:8000" /> (or the appropriate URL)
				in your web browser
			</li>
		</ol>
		<LinkableTitle h1 centered title="Debian service" />
		<ol>
			<li>
				Create a new systemd service file for your PHP website by running the
				command
				<InlineCode code="sudo nano /etc/systemd/system/FileShare.service" />
			</li>
			<li>
				Download systemd service to
				<InlineCode code="/etc/systemd/system/" /> by running
				<InlineCode
					code="sudo wget
							https://raw.githubusercontent.com/Toomas633/FileShare/main/examples/FileShare.service" />
				in <InlineCode code="cd /etc/systemd/system/" />
			</li>
			<li>
				Make sure to replace "/path/to/start.sh" with the path to the FileShare
				website folder that contains the start.sh file on your server
			</li>
			<li>
				Reload the systemd daemon to recognize the new service by running the
				command <InlineCode code="sudo systemctl daemon-reload" />
			</li>
			<li>
				Start the new service by running the command
				<InlineCode code="sudo systemctl start FileShare.service" />
			</li>
			<li>
				Verify that the service is running properly by checking the status with
				the command
				<InlineCode code="sudo systemctl status FileShare.service" />
			</li>
			<li>
				If the service is running correctly, enable it to start at boot time by
				running the command
				<InlineCode code="sudo systemctl enable FileShare.service" />
			</li>
		</ol>
		<LinkableTitle h1 centered title="Windows" />
		Enable running the website in the background (or just double click to run
		once in a dialog box):
		<ol>
			<li>
				Open the Task Scheduler by pressing the Windows key + R, typing
				"taskschd.msc" and hitting Enter.
			</li>
			<li>
				Click on the "Create Task" option in the Actions pane on the right-hand
				side of the window.
			</li>
			<li>
				In the "General" tab of the "Create Task" dialog box, enter a name for
				the task in the "Name" field.
			</li>
			<li>
				In the "Security options" section, select the user account you want to
				run the task under.
			</li>
			<li>Click on the "Triggers" tab and click "New".</li>
			<li>
				In the "New Trigger" dialog box, select "At startup" from the "Begin the
				task" drop-down menu.
			</li>
			<li>Click "OK" to save the trigger.</li>
			<li>Click on the "Actions" tab and click "New".</li>
			<li>
				In the "New Action" dialog box, select "Start a program" from the
				"Action" drop-down menu.
			</li>
			<li>
				In the "Program/script" field, enter the full path to the
				<InlineCode code="start.bat" /> file.
			</li>
			<li>Click "OK" twice to save the action and task.</li>
		</ol>
		<LinkableTitle h1 centered title="Docker" />
		<p>
			Create a <InlineCode code="docker-compose.yml" />, copy the contents under
			here and run it with <InlineCode code="docker-compose up -d" /> (or
			download the .yml from
			<InlineCode
				code="https://raw.githubusercontent.com/Toomas633/FileShare/main/examples/docker-compose.yml" />
			and edit it) <CodeBlock :code="dockerCompose" />
		</p>
	</v-container>
	<TableOfContents />
</template>

<script setup lang="ts">
import type { Image } from '@/types/image'
import download from '@/assets/images/fileshare/download.webp'
import settings from '@/assets/images/fileshare/settings.webp'
import upload from '@/assets/images/fileshare/upload.webp'
import { IconListItem } from '@/types/iconList'
import useIconListMixin from '@/helpers/iconListMixin'

const { iconListPresets } = useIconListMixin()

const images: Image[] = [
	{
		src: upload,
		alt: 'Upload',
	},
	{
		src: download,
		alt: 'Upload',
	},
	{
		src: settings,
		alt: 'Settings',
	},
]

const repo = 'toomas633/fileshare'

const dockerCompose = `version: '3.9'
services:
  fileshare:
    image: ghcr.io/toomas633/fileshare:latest #or version number instead of latest
	container_name: fileshare #container name, can be set different
	ports:
	  - "8080:80" #map port 8080 from host to 80 on container
	environment:
      - TZ=Europe/London #default timezone for the container and on first database creation
	  - MAX_FILESIZE=5M #allowed uploaded file size
	  - PASSWORD=Password.123 #password for settings page login, set your own or change it on the page
	volumes:
	  - /host/path1:/var/www/html/uploads/ # volume or host dir to a folder where uploads will be held
	  - /host/path2:/var/www/html/db/ # volume or host dir to a folder where the database will be held
	restart: always`

const features: IconListItem[] = [
	{ icon: 'mdi-file-upload', color: '#1e88e5', text: 'Single file upload' },
	{ icon: 'mdi-dice-multiple', color: '#8e24aa', text: 'Random name toggle' },
	{ icon: 'mdi-message-alert', color: '#fb8c00', text: 'Status popups' },
	{ icon: 'mdi-file-eye', color: '#00acc1', text: 'File preview icons' },
	{
		icon: 'mdi-timer-sand',
		color: '#f9a825',
		text: 'Delete time slider (1-12h, 24h, never)',
	},
	{ icon: 'mdi-content-copy', color: '#43a047', text: 'Easy link copy' },
	{
		icon: 'mdi-delete-clock',
		color: '#e53935',
		text: 'Automatic file deletion',
	},
	{
		icon: 'mdi-responsive',
		color: '#3949ab',
		text: 'Responsive css for all screen sizes',
	},
	{
		icon: 'mdi-download-box',
		color: '#1976d2',
		text: 'Download page with download and delete actions, file info and delete time',
	},
	{
		icon: 'mdi-cloud-upload',
		color: '#1e88e5',
		text: 'Upload page with drag and drop, file select, random name and delete time options',
	},
	{
		icon: 'mdi-database',
		color: '#6d4c41',
		text: 'SQLite database for file info storage',
	},
	{
		icon: 'mdi-language-python',
		color: '#3776ab',
		text: 'Python cleanup script for timed deletes',
	},
	iconListPresets.docker({
		text: 'Docker image for easy deployment',
	}),
	{
		icon: 'mdi-shield-account',
		color: '#7e57c2',
		text: 'Admin page with settings: Display timezone, max upload size, passwordchange, file list with delete buttons, custom link address',
	},
]
</script>
