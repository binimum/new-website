<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchGitHubStats, validStats, type GitHubStats } from '$lib/githubStats';

	let stats = $state<GitHubStats | null>(null);
	const number = new Intl.NumberFormat('en-GB');
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
			.finally(() => clearTimeout(timeout));
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
			title="Stars across binimum’s public repositories and Monochrome"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				aria-hidden="true"
				><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg
			>
			<span
				>{number.format(stats.stars)} stars
				<span class="sr-only">across binimum’s repositories and Monochrome</span></span
			>
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
			<span>{number.format(stats.followers)} followers</span>
		</a>
	</div>
{/if}

<style>
	.github-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 20px;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 44px;
	}
	svg {
		width: 17px;
		height: 17px;
		flex-shrink: 0;
	}
</style>
