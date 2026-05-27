<template>
	<v-container>
		<v-row class="mt-0 d-block d-md-flex" justify="center">
			<v-col>
				<v-card class="text-center pa-4 h-100" elevation="4">
					<h1 class="text-center">Contact</h1>
					<p class="text-center">
						Having trouble? Raise a new Issue on project's GitHub, leave a
						comment, fill out the contact form.<br />
						<b>
							<i>
								(Any spam will result in automatic permanent IP ban and
								reporting)
							</i>
						</b>
					</p>
				</v-card>
			</v-col>
			<v-col>
				<v-card class="text-center pa-4 h-100" elevation="4">
					<h1 class="text-center">Email</h1>
					<p class="text-center">
						If for watherver reason you can't or don't want to use the contact
						form you can also directly email me at:<br />
						<LinkComponent
							href="mailto:info@toomas633.com"
							text="info@toomas633.com"
							icon="mdi-email-outline"></LinkComponent>
					</p>
				</v-card>
			</v-col>
		</v-row>
		<v-row class="d-block d-md-flex" justify="center">
			<v-col class="d-none d-md-block">
				<MapComponent id="map" class="h-100 elevation-4" />
			</v-col>
			<v-col>
				<v-card class="text-center pa-4 h-100" elevation="4">
					<h1 class="text-center pb-3">Contact Form</h1>
					<v-form ref="form" v-model="valid">
						<v-row justify="center">
							<v-col class="pt-0">
								<v-text-field
									v-model="email"
									label="Email"
									:rules="emailRules"
									placeholder="johndoe@gmail.com"
									prepend-inner-icon="mdi-email-arrow-left-outline"
									min-width="300"
									required />
							</v-col>
							<v-col class="pt-0">
								<v-autocomplete
									v-model="project"
									label="Project"
									:items="projects"
									prepend-inner-icon="mdi-toolbox"
									:rules="autocompleteRules"
									:item-props="
										(item: { title: string; icon: string }) => ({
											prependIcon: item.icon,
										})
									"
									min-width="300"
									required />
							</v-col>
						</v-row>
						<v-textarea
							v-model="message"
							class="pt-4"
							label="Message..."
							:rules="textRules"
							prepend-inner-icon="mdi-format-align-left"
							counter="250"
							required />
						<v-btn
							class="mt-2"
							:disabled="!valid"
							:loading="loading"
							aria-label="Send button"
							@click="submit">
							<v-icon icon="mdi-email-fast" class="mr-1" /> Send
						</v-btn>
					</v-form>
				</v-card>
			</v-col>
			<v-col class="d-block d-md-none">
				<MapComponent id="map2" class="h-100" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useAlertMixin from '@/helpers/alertMixin'
import { EmailData } from '@/types/email'
import { sendEmail } from '@/services/emailService'

const valid = ref(false)
const loading = ref(false)
const email = ref('')
const project = ref('')
const message = ref('')

const { showErrorMessage, showSuccessMessage } = useAlertMixin()

const knownDomains = new Set([
	'gmail.com',
	'yahoo.com',
	'outlook.com',
	'hotmail.com',
	'icloud.com',
	'aol.com',
	'protonmail.com',
	'mail.com',
	'yandex.com',
	'zoho.com',
	'toomas633.com',
])
const projects = [
	{ title: 'T6 Drone', icon: 'mdi-quadcopter' },
	{ title: 'Robotic Arm', icon: 'mdi-robot-industrial' },
	{ title: 'File Organizer', icon: 'mdi-file-document-arrow-right' },
	{ title: 'FileShare', icon: 'mdi-share-variant' },
]

const emailRules = computed(() => {
	return [
		(v: string) => !!v || 'Required',
		(v: string) => validateEmail(v) || 'E-mail must be valid',
		(v: string) =>
			isKnownDomain(v) === true ||
			`This email domain (${isKnownDomain(v)}) is not allowed, if this is a mistake email info@toomas633.com`,
	]
})

const textRules = computed(() => {
	return [
		(value: string) => !!value || 'Required.',
		(value: string) => (value && value.length >= 3) || 'Min 3 characters',
		(value: string) => (value && value.length < 250) || 'Max 250 characters',
	]
})

const autocompleteRules = computed(() => {
	return [(value: string) => !!value || 'Required']
})

const submit = async () => {
	loading.value = true
	try {
		const data: EmailData = {
			from: email.value,
			project: project.value,
			message: message.value,
		}
		const response = await sendEmail(data)
		if (response.data.success) {
			loading.value = false
			showSuccessMessage('Email sent')
		} else {
			loading.value = false
			showErrorMessage(response.data as Error)
		}
	} catch (error) {
		loading.value = false
		showErrorMessage(error as Error)
	}
}

function validateEmail(v: string) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	return emailRegex.test(v)
}

function isKnownDomain(email: string) {
	const domain = email.split('@')[1]
	return knownDomains.has(domain) || domain
}
</script>
