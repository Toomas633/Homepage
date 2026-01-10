<template>
	<v-row justify="center" class="d-block d-sm-flex">
		<v-col md="6" lg="5" class="pb-0" style="max-height: 45.5rem">
			<ImageCarousel class="mt-3" :images="images" />
		</v-col>
		<v-col class="pl-0">
			<h1 class="text-center mt-4">V2</h1>
			<p :class="!isMobile ? 'text-center' : 'ml-4'">
				Removed the custom joystick, moved servo connections down to pins 2-7
				and added a USB HID hat for using XBOX controller input via usb wire.
				For a usb hat I used
				<LinkComponent
					text="this"
					href="https://www.amazon.de/-/en/Hailege-Shield-Support-Google-Android/dp/B07YJQBGFW/ref=sr_1_1?crid=M0CZAVK8EEDM&dib=eyJ2IjoiMSJ9.uxUOWxowuN8wYjbckG61t4ETkl0BpUuPhKclKIu9ho0o56Rn-vxTOaOF1tx2MxtXGIvQPB9M4kJzaTuCvBazbLzo6LAThyz5McKRkB2MxVcqcv8Ckryv2YWeAoQTCv9OGmOkT9vNWi5bc9CLGh0TITjfdcn22-Vtc70pGIklAHo.dDYbhTCGCTeHEG1vmHcJjQNKjNQsKwl8qKGSgwjLumM&dib_tag=se&keywords=arduino+uno+usb+hat&qid=1725008057&sprefix=arduinouno+usb+hat%2Caps%2C128&sr=8-1" />
				one but any should work aslong as they are supported by the
				<LinkComponent
					text="USB Host Shield Library 2.0"
					href="https://www.arduino.cc/reference/en/libraries/usb-host-shield-library-2.0/" />
				and do not require custom drivers. The hat makes the arduino a bit
				higher and for connecting the usb you would need standoffs between the
				base of the arm and the top where servos connect.
			</p>
			<v-row justify="center" class="mt-4">
				<v-col sm="5" md="4" lg="3">
					<ButtonCard
						text="Download"
						href="https://github.com/Toomas633/Arduino-Robotic-Arm/releases/download/v2/Robotic-Arm-v2.ino"
						icon="mdi-file-download-outline" />
				</v-col>
				<v-col sm="5" md="4" lg="3">
					<ButtonCard
						text="GitHub"
						href="https://github.com/Toomas633/Arduino-Robotic-Arm/tree/v2"
						icon="mdi-github" />
				</v-col>
				<v-col sm="5" md="4" lg="3">
					<ButtonCard
						text="Thingiverse"
						href="https://www.thingiverse.com/thing:5391135"
						icon="mdi-rocket-launch"
						icon-color="blue" />
				</v-col>
			</v-row>
			<v-card elevation="4" class="pa-4 mt-6">
				<h1 class="text-center mb-2">Contol scheme</h1>
				<div class="d-flex justify-center">
					<div class="d-block mr-2">
						<p class="d-flex align-center mb-2">
							<v-img
								:src="A"
								color="black"
								rounded="circle"
								height="28"
								width="28"
								alt="Xbox A Button"
								class="ma-2" />
							Gripper open/close
						</p>
						<p class="d-flex align-center mb-2">
							<v-img
								:src="RightStickX"
								color="black"
								rounded="circle"
								height="28"
								width="28"
								max-width="28"
								alt="Xbox Right Stick X"
								class="ma-2" />
							Rotate Left-Right
						</p>
						<p class="d-flex align-center mb-2">
							<v-img
								:src="RightStickY"
								color="black"
								rounded="circle"
								height="28"
								width="28"
								max-width="28"
								alt="Xbox Right Stick Y"
								class="ma-2" />
							Move Up-Down
						</p>
					</div>
					<v-divider
						class="mx-1 border-opacity-100"
						thickness="2"
						color="primary"
						vertical />
					<div class="d-block ml-2">
						<p class="d-flex align-center mb-2">
							<v-img
								:src="LeftStickX"
								color="black"
								rounded="circle"
								height="28"
								width="28"
								alt="Xbox Left Stick X"
								class="ma-2" />
							Rotate Gripper Left-Right
						</p>
						<p class="d-flex align-center mb-2">
							<v-img
								:src="LeftStickY"
								color="black"
								rounded="circle"
								height="28"
								max-width="28"
								alt="Xbox Left Stick Y"
								class="ma-2" />
							Extend-Retract
						</p>
						<p class="d-flex align-center mb-2">
							<span class="d-flex ma-2">
								<v-img
									:src="B"
									color="black"
									rounded="circle"
									height="28"
									width="28"
									alt="Xbox B Button" />
								<v-icon icon="mdi-plus" />
								<v-img
									:src="LeftStickY"
									color="black"
									rounded="circle"
									height="28"
									width="28"
									alt="Xbox Left Stick Y" />
							</span>
							Gripper Up-Down
						</p>
					</div>
				</div>
			</v-card>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
import arm from '@/assets/images/robotic-arm/arm.webp'
import wiring from '@/assets/images/robotic-arm/v2/wiring.webp'
import list from '@/assets/images/robotic-arm/v2/list.webp'
import A from '@/assets/icons/controller/a.svg'
import B from '@/assets/icons/controller/b.svg'
import RightStickX from '@/assets/icons/controller/right-stick-x.svg'
import RightStickY from '@/assets/icons/controller/right-stick-y.svg'
import LeftStickX from '@/assets/icons/controller/left-stick-x.svg'
import LeftStickY from '@/assets/icons/controller/left-stick-y.svg'
import { isMobile } from '@basitcodeenv/vue3-device-detect'

const images = [
	{
		src: arm,
		alt: 'Arm V2',
		title: 'Robotic Arm V2',
	},
	{
		src: wiring,
		alt: 'Wiring',
		title: 'Wiring Diagram',
	},
	{
		src: list,
		alt: 'List',
		title: 'Parts List',
	},
]
</script>
