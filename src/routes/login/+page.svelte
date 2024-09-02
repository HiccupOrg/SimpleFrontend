<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { Turnstile } from 'svelte-turnstile';
	import { getCurrentColorMode } from '$lib/darkMode';
	import { infoToast } from '$lib/components/toast/Toaster.svelte';
	import { GraphQLClient, LOGIN_CLASSIC } from '$lib/business';
	import type {
		LoginClassicMutation,
		LoginClassicMutationVariables
	} from '$lib/business.generated';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { ApolloError } from '@apollo/client/core';
	import { auth, userLoggedIn } from '$lib/store';

	let submitting = false;
	let challengeToken: null | string = null;
	let username: string = '';
	let password: string = '';
	let turnstileDOM: Turnstile;

	if (browser && userLoggedIn()) {
		infoToast('Already login', 'Redirecting to home page in 3 seconds', 3000);
		setTimeout(() => goto('/home'), 3000);
	}

	function onFormSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (submitting) {
			return;
		}

		submitting = true;

		(async () => {
			if (typeof challengeToken !== 'string') {
				infoToast('Captcha Error', 'You must finish captcha challenge first', 1500);
				return;
			}

			try {
				const result = await GraphQLClient.mutate<
					LoginClassicMutation,
					LoginClassicMutationVariables
				>({
					mutation: LOGIN_CLASSIC,
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

				if (browser) {
					auth.set({
						token: result.data!.loginClassic.token
					});
				}
			} catch (err) {
				if (err instanceof ApolloError) {
					infoToast('Login failed', err.message, 3000);
					return;
				}
			}

			infoToast('Login success', 'Redirecting to home page in 3 seconds', 3000);

			setTimeout(() => goto('/home'), 3000);
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
				action="login"
				size="flexible"
				bind:this={turnstileDOM}
				on:callback={captchaCallback}
				on:expired={captchaExpired}
			></Turnstile>
			<Button.Root
				type="submit"
				class="my-5 w-full flex-wrap text-default"
				disabled={submitting}>Sign In</Button.Root
			>
			<div class="flex w-full flex-row justify-between text-default">
				<a href="/register">
					<Label.Root class="cursor-pointer font-mono"
						>No account? Go create one</Label.Root
					>
				</a>
			</div>
		</form>
	</div>
</div>

<style lang="scss">
	.left-image {
		background-size: cover;
		background-image: url('/assets/images/LoginBackground.jpeg');
	}
</style>
