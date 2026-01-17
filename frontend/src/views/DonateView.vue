<template>
	<v-container>
		<h1 class="text-center">For those who wish to help</h1>
		<p class="text-center">
			Here are links to support my projects, for any amount you feel like.
		</p>
		<v-row class="pt-4" justify="center">
			<v-col xl="3" lg="4" md="5" sm="6">
				<ButtonCard
					size="260"
					image-size="240"
					title="Amazon DE"
					href="https://www.amazon.de/hz/wishlist/ls/2MCH6EAMYMPHL?ref_=wl_share"
					:image="Amazon"
					:image-dark="AmazonDark" />
			</v-col>
			<v-col xl="3" lg="4" md="5" sm="6">
				<PayPalBtn :is-btn="false" />
			</v-col>
		</v-row>
	</v-container>
</template>
<script setup lang="ts">
import Amazon from '@/assets/icons/donate/amazon.svg'
import AmazonDark from '@/assets/icons/donate/amazon-dark.svg'
</script>
