<template>
	<div
		class="ac-pro rack-device"
		:class="{ selected }"
		role="button"
		tabindex="0"
		aria-label="UniFi AC Pro access point"
		@click.stop="emit('select')"
		@keyup.enter="emit('select')">
		<div class="mount-plate face" />
		<div
			v-for="layer in 4"
			:key="layer"
			class="disc-shell"
			:style="{ transform: `translateZ(${layer * 3}px)` }" />
		<div class="disc face">
			<div class="led-ring" />
			<div class="logo-dot" />
		</div>
	</div>
</template>
<script setup lang="ts">
defineProps<{ selected: boolean }>()
const emit = defineEmits<{ (e: 'select'): void }>()
</script>
<style scoped lang="scss">
.mount-plate {
	position: absolute;
	top: 35px;
	left: 55px;
	width: 40px;
	height: 80px;
	background: linear-gradient(180deg, #2c2c30, #1d1d20);
	border-radius: 4px;
}

.disc-shell {
	position: absolute;
	top: 9px;
	left: 9px;
	width: 132px;
	height: 132px;
	background: #c9cbce;
	border-radius: 50%;
}

.disc {
	position: absolute;
	top: 7px;
	left: 7px;
	width: 136px;
	height: 136px;
	background:
		radial-gradient(
			circle at 38% 32%,
			rgb(255 255 255 / 85%) 0 8%,
			transparent 42%
		),
		radial-gradient(
			circle,
			#fdfdfd 0 48%,
			#e9eaec 49% 51%,
			#fdfdfd 52% 64%,
			#e3e4e6 70% 100%
		),
		radial-gradient(circle, #fdfdfd 0 64%, #e3e4e6 70% 100%);
	border-radius: 50%;
	box-shadow: inset 0 -4px 10px rgb(0 0 0 / 15%);
	transform: translateZ(14px);
}

.led-ring {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 58px;
	height: 58px;
	border: 2px solid #06a7e2;
	border-radius: 50%;
	box-shadow:
		0 0 7px rgb(6 167 226 / 70%),
		inset 0 0 5px rgb(6 167 226 / 50%);
	transform: translate(-50%, -50%);
}

.logo-dot {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 22px;
	height: 22px;
	background: radial-gradient(circle, #f4f5f6 0 60%, #dfe0e3 100%);
	border-radius: 50%;
	transform: translate(-50%, -50%);
}
</style>
