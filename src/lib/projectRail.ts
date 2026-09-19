// TODO: map ordinary page scrolling onto the horizontal track without trapping wheel events.
export function projectRail(
	section: HTMLElement,
	onProgress: (progress: number, index: number) => void
) {
	const panel = section.querySelector<HTMLElement>('.project-panel')!;
	const viewport = section.querySelector<HTMLElement>('.project-viewport')!;
	const track = section.querySelector<HTMLElement>('.project-list')!;
	const media = matchMedia('(prefers-reduced-motion: no-preference)');
	let distance = 0;
	let frame = 0;
	let destroyed = false;

	function getStickyTop() {
		return parseFloat(getComputedStyle(panel).top) || 24;
	}

	function report() {
		const progress = distance > 0 ? Math.max(0, Math.min(1, viewport.scrollLeft / distance)) : 0;
		onProgress(progress, Math.round(progress * Math.max(0, track.children.length - 1)));
	}
	function update() {
		frame = 0;
		if (!section.classList.contains('rail-pinned')) {
			report();
			return;
		}
		const stickyTop = getStickyTop();
		const progress = Math.max(
			0,
			Math.min(distance, stickyTop - section.getBoundingClientRect().top)
		);
		viewport.scrollLeft = progress;
		report();
	}
	function schedule() {
		if (!frame) frame = requestAnimationFrame(update);
	}
	function measure() {
		if (destroyed) return;
		distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
		const stickyTop = getStickyTop();
		const bottomMargin = Math.min(24, Math.max(12, stickyTop));
		const pinned =
			media.matches &&
			panel.offsetHeight <= innerHeight - (stickyTop + bottomMargin) &&
			distance > 0;
		section.classList.toggle('rail-pinned', pinned);
		section.style.setProperty('--rail-height', `${panel.offsetHeight + distance}px`);
		section.dataset.railDistance = String(distance);
		schedule();
	}
	function focus(event: FocusEvent) {
		const target = event.target as HTMLElement;
		const card = target.closest<HTMLElement>('.project');
		if (!card) return;
		if (section.classList.contains('rail-pinned')) {
			revealProject(card);
			return;
		}
		const bounds = card.getBoundingClientRect();
		const visible = viewport.getBoundingClientRect();
		if (bounds.left < visible.left - 1 || bounds.right > visible.right + 1) revealProject(card);
	}
	const resize = new ResizeObserver(measure);
	resize.observe(panel);
	resize.observe(viewport);
	resize.observe(track);
	const mutation = new MutationObserver(() => {
		const stickyTop = getStickyTop();
		const wasInside =
			section.classList.contains('rail-pinned') &&
			section.getBoundingClientRect().top <= stickyTop &&
			section.getBoundingClientRect().bottom >= panel.offsetHeight + stickyTop - 1;
		measure();
		viewport.scrollLeft = 0;
		if (wasInside)
			window.scrollTo({
				top: scrollY + section.getBoundingClientRect().top - stickyTop,
				behavior: 'instant'
			});
	});
	mutation.observe(track, { childList: true });
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', measure);
	media.addEventListener('change', measure);
	viewport.addEventListener('focusin', focus);
	viewport.addEventListener('scroll', report, { passive: true });
	void document.fonts.ready.then(measure);
	measure();
	return {
		destroy() {
			destroyed = true;
			cancelAnimationFrame(frame);
			resize.disconnect();
			mutation.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', measure);
			media.removeEventListener('change', measure);
			viewport.removeEventListener('focusin', focus);
			viewport.removeEventListener('scroll', report);
		}
	};
}

export function revealProject(card: HTMLElement) {
	const section = card.closest<HTMLElement>('.projects')!;
	const viewport = section.querySelector<HTMLElement>('.project-viewport')!;
	const panel = section.querySelector<HTMLElement>('.project-panel')!;
	const cards = [...viewport.querySelectorAll<HTMLElement>('.project')];
	const index = cards.indexOf(card);
	const distance = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
	const offset = cards.length > 1 ? (index / (cards.length - 1)) * distance : 0;
	if (section.classList.contains('rail-pinned')) {
		const stickyTop = parseFloat(getComputedStyle(panel).top) || 24;
		const distance = Number(section.dataset.railDistance || 0);
		window.scrollTo({
			top: scrollY + section.getBoundingClientRect().top - stickyTop + Math.min(offset, distance),
			behavior: 'instant'
		});
	} else {
		viewport.scrollLeft = offset;
		section.scrollIntoView({ block: 'start', behavior: 'instant' });
	}
}
