<template>
	<v-container>
		<h1 class="text-center">Homelab</h1>
		<p class="text-center mb-4">
			An interactive overview of my homelab rack. Drag to look around, click any
			component to highlight it and see what it is, its specs and the services
			it runs.
		</p>
		<v-row>
			<v-col cols="12" lg="8">
				<HomelabRack :selected-id="selectedId" @select="onSelect" />
			</v-col>
			<v-col cols="12" lg="4">
				<v-card v-if="selected" class="overview-card" variant="tonal">
					<v-card-item>
						<v-card-title>{{ selected.name }}</v-card-title>
						<v-card-subtitle>{{ selected.type }}</v-card-subtitle>
					</v-card-item>
					<v-card-text>
						<v-chip
							size="small"
							color="primary"
							variant="outlined"
							prepend-icon="mdi-server"
							class="mb-3">
							{{ selected.location }}
						</v-chip>
						<v-table density="compact" class="spec-table">
							<tbody>
								<tr v-for="spec in selected.specs" :key="spec.label">
									<td class="spec-label">{{ spec.label }}</td>
									<td>{{ spec.value }}</td>
								</tr>
							</tbody>
						</v-table>
						<template v-if="selected.services.length">
							<h3 class="mt-4 mb-2 text-center">Services</h3>
							<div class="services">
								<div
									v-for="service in selected.services"
									:key="service.name"
									class="service">
									<v-icon
										:icon="service.icon"
										:color="service.color"
										size="28" />
									<span>{{ service.name }}</span>
								</div>
							</div>
						</template>
						<div v-if="selected.link" class="mt-4 text-center">
							<LinkComponent
								:href="selected.link.href"
								:text="selected.link.text" />
						</div>
					</v-card-text>
				</v-card>
				<v-card v-else class="overview-card" variant="tonal">
					<v-card-item>
						<v-card-title>Nothing selected</v-card-title>
					</v-card-item>
					<v-card-text>
						Click a component in the rack to see an overview of it. The Dell
						R730 slides out on its rails with the lid off and the LiPo drawer
						pulls open when selected.
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import HomelabRack from '@/components/homelab/HomelabRack.vue'
import { homelabComponents } from '@/constants/homelab'

const selectedId = ref<string | null>(null)

const selected = computed(
	() =>
		homelabComponents.find((component) => component.id === selectedId.value) ??
		null
)

function onSelect(id: string | null) {
	selectedId.value = selectedId.value === id ? null : id
}
</script>
<style scoped lang="scss">
.overview-card {
	position: sticky;
	top: 16px;
}

.spec-table {
	background: transparent;
}

.spec-label {
	font-weight: 600;
	white-space: nowrap;
}

.services {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	justify-content: center;
}

.service {
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: center;
	width: 72px;
	text-align: center;

	span {
		font-size: 0.7rem;
		line-height: 1.2;
	}
}
</style>
