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
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 centered title="Features" />
		<ul class="ml-4 multicolumn">
			<li>Single file upload</li>
			<li>Random name toggle</li>
			<li>Status popups</li>
			<li>File preview icons</li>
			<li>Delete time slider (1-12h, 24h, never)</li>
			<li>Easy link copy</li>
			<li>Automatic file deletion</li>
			<li>Responsive css for all screen sizes</li>
			<li>
				Download page
				<ul class="ml-4">
					<li>Download, delete buttons</li>
					<li>Delete time</li>
				</ul>
			</li>
			<li>
				Admin page
				<ul class="ml-4">
					<li>Display timezone</li>
					<li>Delete and download buttons</li>
					<li>Delete time</li>
					<li>Hyperlink to download page</li>
					<li>Custom link address</li>
				</ul>
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 centered title="Running instructions" />
		<ul class="ml-4">
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
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 centered title="Requirements" />
		<ul class="ml-4">
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
				<ul class="ml-4">
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
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 centered title="Debian service" />
		<ul class="ml-4">
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
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
		<LinkableTitle h1 centered title="Windows" />
		<ul class="ml-4">
			<li>
				Enable running the website in the background (or just double click to
				run once in a dialog box)
				<ul class="ml-4">
					<li>
						Open the Task Scheduler by pressing the Windows key + R, typing
						"taskschd.msc" and hitting Enter.
					</li>
					<li>
						Click on the "Create Task" option in the Actions pane on the
						right-hand side of the window.
					</li>
					<li>
						In the "General" tab of the "Create Task" dialog box, enter a name
						for the task in the "Name" field.
					</li>
					<li>
						In the "Security options" section, select the user account you want
						to run the task under.
					</li>
					<li>Click on the "Triggers" tab and click "New".</li>
					<li>
						In the "New Trigger" dialog box, select "At startup" from the "Begin
						the task" drop-down menu.
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
				</ul>
			</li>
		</ul>
		<v-divider
			class="mt-4 mb-2 border-opacity-100"
			thickness="2"
			color="primary" />
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
import { dockerCompose } from '@/constants/fileshare'
import type { Image } from '@/types/image'
import download from '@/assets/images/fileshare/download.webp'
import settings from '@/assets/images/fileshare/settings.webp'
import upload from '@/assets/images/fileshare/upload.webp'

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
</script>
