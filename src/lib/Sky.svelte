<script lang="ts">
	import { untrack } from 'svelte';

	let video: HTMLVideoElement;
	let playing = $state(false);
	let reducedMotion = $state(false);
	let userPaused = false;
	let visible = true;

	function syncPlayback() {
		if (!video) return;
		if (userPaused || reducedMotion || !visible || document.hidden) {
			video.pause();
		} else {
			void video.play().catch(() => {
				playing = false;
			});
		}
	}

	function togglePlayback() {
		userPaused = playing;
		syncPlayback();
	}

	function attachVideo(element: HTMLVideoElement) {
		return untrack(() => {
			video = element;
			const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
			const updatePreference = () => {
				reducedMotion = preference.matches;
				syncPlayback();
			};
			updatePreference();
			preference.addEventListener('change', updatePreference);
			document.addEventListener('visibilitychange', syncPlayback);
			const observer = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting;
				syncPlayback();
			});
			observer.observe(video);
			return () => {
				observer.disconnect();
				preference.removeEventListener('change', updatePreference);
				document.removeEventListener('visibilitychange', syncPlayback);
				video.pause();
			};
		});
	}
</script>

<div class="sky" aria-hidden="true">
	<video
		{@attach attachVideo}
		muted
		playsinline
		loop
		preload="none"
		poster="/bg/sky-poster.webp"
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
	>
		<source src="/bg/sky.webm" type="video/webm" />
		<source src="/bg/sky.mp4" type="video/mp4" />
	</video>
	<div class="sky-shade"></div>
</div>
{#if !reducedMotion}
	<button
		class="sky-toggle"
		type="button"
		onclick={togglePlayback}
		aria-label={playing ? 'Pause sky video' : 'Play sky video'}
		aria-pressed={!playing}
	>
		<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
			{#if playing}<path d="M6 5h4v14H6zm8 0h4v14h-4z" />{:else}<path d="m8 5 11 7-11 7Z" />{/if}
		</svg>
	</button>
{/if}

<style>
	.sky {
		position: absolute;
		inset: 0;
		overflow: hidden;
		background: #264985 url('/bg/sky-poster.webp') center / cover;
	}
	video {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		object-position: center;
	}
	.sky-shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(0deg, #10243c99, #10243c12 38%, transparent 65%);
	}
	.sky-toggle {
		position: absolute;
		z-index: 2;
		top: calc(24px + env(safe-area-inset-top, 0px));
		right: max(24px, calc((100% - 1496px) / 2));
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: #163b5370;
		color: white;
		transition:
			background 180ms ease,
			transform 180ms ease;
	}
	.sky-toggle svg {
		width: 19px;
		height: 19px;
	}
	.sky-toggle:hover {
		background: #163b53b0;
	}
	.sky-toggle:active {
		transform: scale(0.96);
	}
	@media (max-width: 760px) {
		video {
			object-position: 72% center;
		}
		.sky {
			background-position: 72% center;
		}
		.sky-toggle {
			top: calc(17px + env(safe-area-inset-top, 0px));
			right: 17px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sky-toggle {
			display: none;
		}
	}
</style>
