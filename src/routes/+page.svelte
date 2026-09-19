<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { seo, structuredDataScript } from '$lib/seo';
	import Arrow from '$lib/Arrow.svelte';
	import Sky from '$lib/Sky.svelte';
	import GitHubLink from '$lib/GitHubLink.svelte';
	import GitHubStats from '$lib/GitHubStats.svelte';
	import RouteMap from '$lib/RouteMap.svelte';
	import { projectRail, revealProject } from '$lib/projectRail';
	import { projects, type Category } from '$lib/projects';

	let category = $state<Category>('All');
	let copied = $state(false);
	let copyError = $state(false);
	let copyReset: ReturnType<typeof setTimeout>;
	let routeProgress = $state(0);
	let activeStation = $state(0);
	function updateRoute(progress: number, index: number) {
		routeProgress = progress;
		activeStation = index;
	}
	let filtered = $derived(
		projects.filter((project) => category === 'All' || project.category === category)
	);

	let featured = $derived(filtered.filter((project) => !project.small));
	let smaller = $derived(filtered.filter((project) => project.small));

	async function selectProject(id: string) {
		category = 'All';
		if (location.hash !== '#project-' + id) history.pushState(null, '', '#project-' + id);
		await tick();
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		const card = document.getElementById('project-' + id);
		if (card?.classList.contains('small-project'))
			card.scrollIntoView({ block: 'center', behavior: 'instant' });
		else if (card) revealProject(card);
	}

	async function copyDiscord() {
		try {
			await navigator.clipboard.writeText('binimum');
			clearTimeout(copyReset);
			copied = true;
			copyReset = setTimeout(() => {
				copied = false;
			}, 2200);
			copyError = false;
		} catch {
			clearTimeout(copyReset);
			copied = false;
			copyError = true;
		}
	}

	function syncProjectFromHash() {
		const id = window.location.hash.replace('#project-', '');
		if (projects.some((project) => project.id === id)) void selectProject(id);
	}

	onMount(() => {
		syncProjectFromHash();
		return () => clearTimeout(copyReset);
	});
</script>

<svelte:window onhashchange={syncProjectFromHash} />

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="author" content="binimum" />
	<meta name="theme-color" content="#292a28" />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={seo.url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="binimum" />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:url" content={seo.url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:image" content={seo.image} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={seo.imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:image:alt" content={seo.imageAlt} />
	<link
		rel="preload"
		href="/bg/sky-poster.webp"
		as="image"
		type="image/webp"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		href="/fonts/manrope-latin-variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html structuredDataScript}
</svelte:head>

<a class="skip-link" href="#projects">Skip to projects</a>

<div class="sky-header" id="top">
	<Sky />
	<header class="masthead">
		<a class="identity" href="#top" aria-label="binimum, back to top">
			<span class="identity-arrow"><Arrow /></span>
			<div class="identity-copy">
				<p>hi. i'm</p>
				<h1>binimum</h1>
			</div>
		</a>
		<div class="header-aside">
			<p>I make stuff<br />that you might like.</p>
			<GitHubLink />
		</div>
	</header>
</div>

<div class="site">
	<main>
		<div class="interchange">
			<nav class="signposts" aria-label="Main navigation">
				<a class="signpost projects-sign" href="#projects"
					><Arrow circle direction="down" /><span>Projects</span><span class="route-letter">1</span
					></a
				>
				<a class="signpost about-sign" href="#about"
					><Arrow circle direction="down" /><span>About me</span><span class="route-letter">2</span
					></a
				>
				<a class="signpost contact-sign" href="#contact"
					><Arrow circle direction="down" /><span>Get in touch</span><span class="route-letter"
						>3</span
					></a
				>
			</nav>
			<div class="map"><RouteMap onselect={selectProject} /></div>
		</div>

		<section
			class="projects"
			id="projects"
			aria-labelledby="projects-title"
			use:projectRail={updateRoute}
			style:--route-progress={routeProgress}
		>
			<div class="project-panel">
				<div class="section-heading">
					<h2 id="projects-title">
						<span class="line-badge green-badge">1</span>Projects
						<span class="heading-arrow"><Arrow direction="right" /></span>
					</h2>
					<GitHubStats />
					<nav class="mini-route" aria-label="Project stations">
						<span class="mini-route-line" aria-hidden="true"></span>
						{#each featured as project, index (project.id)}
							<button
								type="button"
								class:current={activeStation === index}
								aria-label={'Go to ' + project.name}
								aria-current={activeStation === index ? 'step' : undefined}
								title={project.name}
								onclick={() => selectProject(project.id)}
								><span
									style:opacity={Math.min(
										1,
										Math.abs(index / Math.max(1, featured.length - 1) - routeProgress) * 5
									)}
								></span></button
							>
						{/each}
						<span class="route-train" aria-hidden="true"
							><svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" />
								<path d="m9 15-1-1" /><path d="m15 15 1-1" />
								<path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" />
								<path d="m8 19-2 3" /><path d="m16 19 2 3" />
							</svg></span
						>
					</nav>
				</div>
				<div class="project-viewport">
					<div class="project-list">
						{#each featured as project, index (project.id)}
							<article
								class="project expanded"
								class:active-station={activeStation === index}
								id={'project-' + project.id}
							>
								<h3>
									<span class="project-toggle">
										<span class="project-stop" aria-hidden="true"></span>
										<span class="project-name">{project.name}</span>
										<span class="project-description">{project.description}</span>
										<span class="project-arrow"><Arrow direction="diagonal" /></span>
									</span>
								</h3>
								<div class="project-reveal" id={'detail-' + project.id}>
									<div class="project-clip">
										<div class="project-detail">
											<div class={'project-visual visual-' + project.preview}>
												{#if project.preview === 'lyrics'}
													<img
														class="project-poster poster-lyrics"
														src="/am-lyrics.webp"
														alt=""
														loading="lazy"
													/>
												{:else if project.preview === 'clock'}
													<iframe
														class="clock-embed"
														src="https://time.binimum.org"
														title="Live clock at time.binimum.org"
														loading="lazy"
														tabindex="-1"
													></iframe>
												{:else if project.preview === 'binilyrics'}
													<img
														class="project-poster poster-api"
														src="/lyrics-api.webp"
														alt=""
														loading="lazy"
													/>
												{/if}
												{#if project.live}
													<!-- eslint-disable svelte/no-navigation-without-resolve -->
													<a
														class="poster-link"
														href={project.live}
														target="_blank"
														rel="noreferrer"
														aria-label={'Visit ' + project.name}
														><span>Visit project <Arrow direction="diagonal" /></span></a
													>
													<!-- eslint-enable svelte/no-navigation-without-resolve -->
												{/if}
											</div>
											<div class="project-copy">
												<p>
													{#if project.id === 'binilyrics'}My lyrics API, contributed to by the
														community. Used by
														<a
															href="https://github.com/better-lyrics/better-lyrics"
															target="_blank"
															rel="noreferrer">Better Lyrics</a
														>,
														<a
															href="https://github.com/MetrolistGroup/Metrolist"
															target="_blank"
															rel="noreferrer">Metrolist</a
														>,
														<a href="https://monochrome.tf" target="_blank" rel="noreferrer"
															>Monochrome</a
														>, and
														<a
															href="https://github.com/binimum/am-lyrics"
															target="_blank"
															rel="noreferrer">&lt;am-lyrics&gt;</a
														>.{:else}{project.detail}{/if}
												</p>
												<p class="technology">{project.technology}</p>
												<!-- eslint-disable svelte/no-navigation-without-resolve -->
												<div class="project-links">
													{#if project.live}<a href={project.live} target="_blank" rel="noreferrer"
															>Visit project <Arrow direction="diagonal" /></a
														>{/if}
													{#if project.url}<a href={project.url} target="_blank" rel="noreferrer"
															>Source <Arrow direction="diagonal" /></a
														>{/if}
												</div>
												<!-- eslint-enable svelte/no-navigation-without-resolve -->
											</div>
										</div>
									</div>
								</div>
							</article>
						{/each}
					</div>
				</div>
				<a
					class="all-projects"
					href="https://github.com/binimum?tab=repositories"
					target="_blank"
					rel="noreferrer">More on GitHub <Arrow direction="diagonal" /></a
				>
			</div>
		</section>

		{#if smaller.length}
			<section class="small-projects" aria-labelledby="small-projects-title">
				<h2 id="small-projects-title">Smaller projects</h2>
				<div class="small-project-grid">
					{#each smaller as project (project.id)}
						<article
							class="small-project"
							class:monochrome-card={project.id === 'monochrome'}
							id={'project-' + project.id}
						>
							<h3>{project.name}</h3>
							<p>{project.detail}</p>
							<div class="project-links">
								<!-- eslint-disable svelte/no-navigation-without-resolve -->
								{#if project.live}<a href={project.live} target="_blank" rel="noreferrer"
										>Visit project <Arrow direction="diagonal" /></a
									>{/if}
								{#if project.url}<a href={project.url} target="_blank" rel="noreferrer"
										>Source <Arrow direction="diagonal" /></a
									>{/if}
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<section class="about" id="about" aria-labelledby="about-title">
			<div class="section-heading">
				<h2 id="about-title">
					<span class="line-badge yellow-badge">2</span>About me
					<span class="heading-arrow"><Arrow direction="down" /></span>
				</h2>
			</div>
			<div class="about-content">
				<div class="about-symbol" aria-hidden="true">
					<Arrow direction="right" circle /><Arrow direction="diagonal" circle /><Arrow
						direction="down"
						circle
					/>
				</div>
				<div class="about-copy">
					<p>
						👋 I’m binimum. I make stuff. (stuff = fullstack, utilities and small things that make
						me happy).
					</p>
					<p>
						Usually SvelteKit and TS. Sometimes Python or Rust. Regardless of language trying to
						make software that works well and feels good to use.
					</p>
				</div>
			</div>
		</section>

		<section class="contact" id="contact" aria-labelledby="contact-title">
			<div class="section-heading">
				<h2 id="contact-title">
					<span class="line-badge red-badge">3</span>Get in touch
					<span class="heading-arrow" style="transform: rotate(90deg);"
						><Arrow direction="diagonal" /></span
					>
				</h2>
			</div>
			<a class="email" href="mailto:max@binimum.org"
				><span>max@binimum.org</span><Arrow direction="diagonal" /></a
			>
			<div class="contact-discord">
				<button
					type="button"
					class="discord"
					onclick={copyDiscord}
					aria-label={copied ? 'Copied Discord username binimum' : 'Copy Discord username binimum'}
					><svg class="discord-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
						><path
							d="M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5l-.6 1.2a18.3 18.3 0 0 0-5.5 0l-.6-1.2a20 20 0 0 0-4.9 1.5C.7 9 .1 13.5.4 17.9a20 20 0 0 0 6 3l1.2-2a12.8 12.8 0 0 1-1.9-.9l.5-.4a14.3 14.3 0 0 0 11.6 0l.5.4a12.8 12.8 0 0 1-1.9.9l1.2 2a20 20 0 0 0 6-3c.4-5.1-.8-9.6-3.3-13.5ZM8 15.2c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4Zm8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4Z"
						/></svg
					><span>{copied ? 'Copied @binimum' : '@binimum'}</span><span
						class="copy-feedback"
						class:copied
						aria-hidden="true"
					>
						<svg
							class="copy-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><rect x="9" y="9" width="13" height="13" rx="2" /><path
								d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
							/></svg
						>
						<svg
							class="check-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="m20 6-11 11-5-5" /></svg
						>
					</span></button
				>
				<span class="sr-only" role="status"
					>{copied
						? 'Discord username copied to clipboard.'
						: copyError
							? 'Could not copy. Discord username: binimum.'
							: ''}</span
				>
				{#if copyError}<span>Copy manually: @binimum</span>{/if}
			</div>
			<div class="contact-bottom">
				<GitHubLink />
				<p class="design-credit">
					Inspired by <a href="https://pid.cz/en/legible-prague/" target="_blank" rel="noreferrer"
						>Legible Prague</a
					>
				</p>
				<a class="back-to-top-f-you-easylist" href="#top">Back up <Arrow direction="up" circle /></a>
			</div>
		</section>
	</main>
</div>
