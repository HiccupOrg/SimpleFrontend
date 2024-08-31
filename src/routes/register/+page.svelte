<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { Turnstile } from 'svelte-turnstile';
	import { getCurrentColorMode } from '$lib/darkMode';
	import { addToast } from '$lib/components/toast/Toaster.svelte';
	import { GraphQLClient, REGISTER_CLASSIC_IDENTIFY } from '$lib/business';
	import type {
		RegisterClassicMutation,
		RegisterClassicMutationVariables
	} from '$lib/business.generated';
	import { goto } from '$app/navigation';
	import { ApolloError } from '@apollo/client/core';

	let submitting = false;
	let challengeToken: null | string = null;
	let username: string = '';
	let password: string = '';
	let turnstileDOM: Turnstile;

	function onFormSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (submitting) {
			return;
		}

		submitting = true;

		(async () => {
			if (typeof challengeToken !== 'string') {
				addToast({
					data: {
						title: 'Captcha Error',
						description: 'You must finish captcha challenge first'
					},
					closeDelay: 1500
				});
				return;
			}

			try {
				await GraphQLClient.mutate<
					RegisterClassicMutation,
					RegisterClassicMutationVariables
				>({
					mutation: REGISTER_CLASSIC_IDENTIFY,
					variables: {
						username,
						password
					},
					context: {
						headers: {
							'X-Hiccup-Captcha': challengeToken
						}
					}
				});
			} catch (err) {
				if (err instanceof ApolloError) {
					addToast({
						data: {
							title: 'Register failed',
							description: err.message
						},
						closeDelay: 1500
					});
					return;
				}
			}

			addToast({
				data: {
					title: 'Register success',
					description: 'Redirecting to login page in 3 seconds',
					color: 'green'
				},
				closeDelay: 3000
			});

			setTimeout(() => goto('/login'), 3000);
		})().finally(() => {
			submitting = false;
		});
	}

	function captchaCallback(event: CustomEvent<{ token: string }>) {
		challengeToken = event.detail.token;
	}

	function captchaExpired() {
		challengeToken = null;
		turnstileDOM.reset();
	}
</script>

<div class="flex h-screen flex-row flex-nowrap">
	<div class="left-image h-screen basis-1/3"></div>
	<div
		class="flex h-screen basis-2/3 flex-col content-center items-center justify-center bg-background"
	>
		<form on:submit={onFormSubmit} class="flex w-2/5 flex-col items-center justify-center">
			<Label.Root class="self-start">Username</Label.Root>
			<input
				type="text"
				class="h-10 w-full rounded-md bg-primary/30 px-3 py-2 text-default shadow-2xl"
				placeholder="Enter your username"
				bind:value={username}
			/>
			<Label.Root class="self-start">Password</Label.Root>
			<input
				type="password"
				class="h-10 w-full rounded-md bg-primary/30 px-3 py-2 text-default shadow-2xl"
				placeholder="Enter your password"
				bind:value={password}
			/>
			<Turnstile
				class="my-3"
				siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
				theme={getCurrentColorMode()}
				execution="render"
				appearance="interaction-only"
				action="register"
				size="flexible"
				bind:this={turnstileDOM}
				on:callback={captchaCallback}
				on:expired={captchaExpired}
			></Turnstile>
			<Button.Root
				type="submit"
				class="my-5 w-full flex-wrap text-default"
				disabled={submitting}>Register</Button.Root
			>
		</form>
	</div>
</div>

<svelte:head>
	<title>Register | Hiccup</title>
</svelte:head>

<style lang="scss">
	.left-image {
		background-size: cover;
		background-image: url('/assets/images/LoginBackground.jpeg');
	}
</style>
