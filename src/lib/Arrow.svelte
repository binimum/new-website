<script lang="ts">
	const clipId = $props.id();
	let {
		direction = 'right',
		circle = false
	}: { direction?: 'right' | 'down' | 'up' | 'diagonal'; circle?: boolean } = $props();
</script>

<svg
	class="arrow"
	viewBox="0 0 64 64"
	fill="none"
	aria-hidden="true"
	style:--rotation={direction === 'down'
		? '90deg'
		: direction === 'up'
			? '-90deg'
			: direction === 'diagonal'
				? '-45deg'
				: '0deg'}
>
	{#if circle}<circle cx="32" cy="32" r="31" fill="currentColor" />{/if}
	<defs>
		<clipPath id={clipId} clipPathUnits="userSpaceOnUse">
			<circle cx="32" cy="32" r="30" />
		</clipPath>
	</defs>
	<g clip-path={circle ? `url(#${clipId})` : undefined}>
		{#each circle ? [0, direction === 'up' ? 64 : -64] : [0] as offset (offset)}
			<path
				class="arrow-glyph"
				style:--arrow-offset={offset + 'px'}
				d="M13 32H48M33 17L48 32L33 47"
				stroke={circle ? 'var(--bg, #292a28)' : 'currentColor'}
				stroke-width="7"
				stroke-linejoin="miter"
			/>
		{/each}
	</g>
</svg>

<style>
	.arrow {
		display: block;
		width: 1em;
		height: 1em;
		flex-shrink: 0;
	}
	path {
		transform-box: view-box;
		transform-origin: 32px 32px;
		transform: translateY(calc(var(--arrow-travel, 0px) + var(--arrow-offset)))
			rotate(var(--rotation));
		transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		path {
			transition: none;
		}
	}
</style>
