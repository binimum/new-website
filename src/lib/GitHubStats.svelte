<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchGitHubStats, validStats, type GitHubStats } from '$lib/githubStats';

	import type { Locale, Messages } from './i18n';

	let {
		copy,
		locale
	}: { copy: Pick<Messages, 'starsTitle' | 'stars' | 'starsScope' | 'followers'>; locale: Locale } =
		$props();

	let stats = $state<GitHubStats | null>(null);
	let number = $derived(
		typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function'
			? new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-GB')
			: { format: (value: number) => String(value) }
	);
	onMount(() => {
		const key = 'binimum-github-stats-v1';
		try {
			const cached: unknown = JSON.parse(localStorage.getItem(key) || 'null');
			if (
				validStats(cached) &&
				Date.now() >= cached.updatedAt &&
				Date.now() - cached.updatedAt < 3_600_000
			) {
				stats = cached;
				return;
			}
		} catch {
			// no storage ig
		}
		if (typeof fetch !== 'function' || typeof AbortController !== 'function') return;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 15_000);
		void fetchGitHubStats(controller.signal)
			.then((result) => {
				if (controller.signal.aborted) return;
				stats = result;
				try {
					localStorage.setItem(key, JSON.stringify(result));
				} catch {
					// Optional
				}
			})
			.catch(() => {
				/* don't display invented counts when GitHub is unavailable. */
			})
			.then(() => clearTimeout(timeout));
		return () => {
			clearTimeout(timeout);
			controller.abort();
		};
	});
</script>

{#if stats}
	<div class="github-stats">
		<a
			href="https://github.com/binimum?tab=repositories"
			target="_blank"
			rel="noreferrer"
			title={copy.starsTitle}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				aria-hidden="true"
				><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg
			>
			<span>{copy.stars(number.format(stats.stars))}</span>
			<span class="sr-only">{copy.starsScope}</span>
		</a>
		<a href="https://github.com/binimum?tab=followers" target="_blank" rel="noreferrer">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				aria-hidden="true"
				><circle cx="9" cy="8" r="3" /><path
					d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3"
				/></svg
			>
			<span>{copy.followers(number.format(stats.followers))}</span>
		</a>
	</div>
{/if}

<style>
	@supports (display: block) {
		.github-stats {
			display: flex;
			flex-wrap: wrap;
			grid-gap: 4px 20px;
			gap: 4px 20px;
			font-size: 14px;
			font-variant-numeric: tabular-nums;
		}
		a {
			display: inline-flex;
			align-items: center;
			grid-gap: 7px;
			gap: 7px;
			min-height: 44px;
		}
		svg {
			width: 17px;
			height: 17px;
			flex-shrink: 0;
		}
	}
</style>
