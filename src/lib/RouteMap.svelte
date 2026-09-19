<script lang="ts">
	let { onselect }: { onselect: (id: string) => void } = $props();
	const stops = [
		{ id: 'am-lyrics', name: 'am-lyrics', desktop: [130, 141, 95, 112], mobile: [50, 105, 18, 79] },
		{
			id: 'binilyrics',
			name: 'binilyrics',
			desktop: [262, 141, 235, 112],
			mobile: [140, 105, 119, 79]
		},
		{
			id: 'live-bitrate-test',
			name: 'live-bitrate-test',
			desktop: [653, 208, 562, 247],
			mobile: [335, 165, 277, 195]
		},
		{
			id: 'time',
			name: 'time.binimum.org',
			desktop: [126, 280, 69, 320],
			mobile: [75, 282, 18, 316]
		},
		{
			id: 'browser-test',
			name: 'browser-test',
			desktop: [557, 72, 481, 43],
			mobile: [145, 230, 173, 237]
		},
		{
			id: 'open-spotify-api',
			name: 'open-spotify-api',
			desktop: [693, 72, 600, 112],
			mobile: [355, 48, 272, 25]
		}
	];
	const layouts = [
		{
			kind: 'desktop' as const,
			viewBox: '0 0 800 375',
			green: 'M30 141H270Q290 141 310 161L337 188Q357 208 378 208H751',
			yellow: 'M30 280H245Q280 280 280 245V229Q280 208 301 208H378L491 95Q514 72 544 72H751',
			red: 'M378 14V208L451 281Q463 293 463 310V350',
			greenEnd: 'm739 195 13 13-13 13',
			yellowEnd: 'm739 59 13 13-13 13',
			redEnd: 'm450 337 13 13 13-13',
			center: [378, 208],
			label: [360, 249],
			about: [378, 42, 276, 49],
			contact: [463, 318, 487, 325]
		},
		{
			kind: 'mobile' as const,
			viewBox: '0 0 420 380',
			green: 'M18 105H146Q160 105 170 115L208 153Q220 165 240 165H396',
			yellow: 'M18 282H113Q145 282 145 250V205Q145 165 185 165H218L321 62Q335 48 353 48H396',
			red: 'M218 14V165L247 194Q265 212 265 234V353',
			greenEnd: 'm386 155 10 10-10 10',
			yellowEnd: 'm386 38 10 10-10 10',
			redEnd: 'm255 343 10 10 10-10',
			center: [218, 165],
			label: [198, 200],
			about: [218, 42, 139, 43],
			contact: [265, 320, 286, 327]
		}
	];
</script>

{#each layouts as layout (layout.kind)}
	<svg
		class="route-map"
		class:mobile-map={layout.kind === 'mobile'}
		class:desktop-map={layout.kind === 'desktop'}
		viewBox={layout.viewBox}
		role="group"
		aria-label="Project map. Select a station to explore a project."
	>
		<path class="route green" d={layout.green} />
		<path class="route yellow" d={layout.yellow} />
		<path class="route red" d={layout.red} />
		<path class="end green" d={layout.greenEnd} />
		<path class="end yellow" d={layout.yellowEnd} />
		<path class="end red" d={layout.redEnd} />
		<circle class="interchange-stop" cx={layout.center[0]} cy={layout.center[1]} r="13" />
		<text class="you" x={layout.label[0]} y={layout.label[1]}>binimum</text>
		{#each stops as stop (stop.id)}
			{@const coords = stop[layout.kind]}
			<a
				href={'#project-' + stop.id}
				onclick={(event) => {
					event.preventDefault();
					onselect(stop.id);
				}}
				aria-label={'Explore ' + stop.name}
			>
				<circle class="hit" cx={coords[0]} cy={coords[1]} r="28" />
				<circle class="station" cx={coords[0]} cy={coords[1]} r="6" />
				<text x={coords[2]} y={coords[3]}>{stop.name}</text>
			</a>
		{/each}
		<a href="#about" aria-label="About me">
			<circle class="hit" cx={layout.about[0]} cy={layout.about[1]} r="28" />
			<circle class="station" cx={layout.about[0]} cy={layout.about[1]} r="6" />
			<text x={layout.about[2]} y={layout.about[3]}>About me</text>
		</a>
		<a href="#contact" aria-label="Get in touch">
			<circle class="hit" cx={layout.contact[0]} cy={layout.contact[1]} r="28" />
			<circle class="station" cx={layout.contact[0]} cy={layout.contact[1]} r="6" />
			<text x={layout.contact[2]} y={layout.contact[3]}>Get in touch</text>
		</a>
	</svg>
{/each}

<style>
	.route-map {
		width: 100%;
		overflow: visible;
	}
	.mobile-map {
		display: none;
	}
	.route {
		fill: none;
		stroke-width: 12;
	}
	.green {
		stroke: var(--green);
	}
	.yellow {
		stroke: var(--yellow);
	}
	.red {
		stroke: var(--red);
	}
	.end {
		fill: none;
		stroke-width: 8;
	}
	.station {
		fill: var(--bg);
		transition:
			fill 180ms ease,
			r 180ms ease;
	}
	.interchange-stop {
		fill: var(--bg);
		stroke: var(--white);
		stroke-width: 4;
	}
	.hit {
		fill: transparent;
	}
	text {
		fill: var(--white);
		font-family: inherit;
		font-size: 20px;
		font-weight: 500;
		letter-spacing: -0.4px;
	}
	.you {
		text-anchor: middle;
		font-size: 22px;
		font-weight: 650;
	}
	a {
		cursor: pointer;
		outline: none;
	}
	a:hover .station,
	a:focus-visible .station {
		fill: var(--white);
		r: 9;
	}
	a:hover text,
	a:focus-visible text {
		text-decoration: underline;
		text-underline-offset: 5px;
	}
	@media (max-width: 760px) {
		.desktop-map {
			display: none;
		}
		.mobile-map {
			display: block;
			max-width: 500px;
			margin-inline: auto;
		}
		text {
			font-size: 15px;
			letter-spacing: -0.3px;
		}
		.you {
			font-size: 20px;
		}
		.route {
			stroke-width: 9;
		}
		.end {
			stroke-width: 6;
		}
		.station {
			r: 5;
		}
		.interchange-stop {
			r: 10;
			stroke-width: 3;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.station {
			transition: none;
		}
	}
</style>
