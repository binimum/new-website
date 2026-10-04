import { listenToMedia } from './mediaPreference';

export function projectRail(
	section: HTMLElement,
	onProgress: (progress: number, index: number) => void
) {
	// Keep the styled grid until the independent rail dependencies are available.
	if (
		typeof CSS === 'undefined' ||
		typeof CSS.supports !== 'function' ||
		!CSS.supports('(display: flex) and (color: var(--white))') ||
		!CSS.supports('position', 'sticky') ||
		typeof MutationObserver === 'undefined' ||
		typeof matchMedia !== 'function'
	)
		return;
	const media = matchMedia('(prefers-reduced-motion: reduce)');
	const panel = section.querySelector<HTMLElement>('.project-panel')!;
	const viewport = section.querySelector<HTMLElement>('.project-viewport')!;
	const track = section.querySelector<HTMLElement>('.project-list')!;
	let distance = 0;
	let frame = 0;
	let destroyed = false;
	let fallbackSize = '';

	function getStickyTop() {
		return parseFloat(getComputedStyle(panel).top) || 24;
	}

	function report() {
		const progress =
			section.classList.contains('rail-ready') && distance > 0
				? Math.max(0, Math.min(1, viewport.scrollLeft / distance))
				: 0;
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
		const size = `${innerWidth}:${innerHeight}`;
		// Do not repeatedly switch a fallback grid into a rail during observer callbacks.
		// The temporary height change can disturb native fragment scrolling.
		if (!section.classList.contains('rail-ready') && fallbackSize === size) return;
		const previousScrollY = scrollY;
		// Measure the enhanced layout before deciding whether it is usable here.
		section.classList.add('rail-ready');
		distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
		const stickyTop = getStickyTop();
		const bottomMargin = Math.min(24, Math.max(12, stickyTop));
		let pinned =
			!media.matches &&
			getComputedStyle(track).display === 'flex' &&
			viewport.clientWidth > 0 &&
			panel.offsetHeight <= innerHeight - (stickyTop + bottomMargin) &&
			distance > 0;
		if (pinned) {
			// A support query alone cannot detect a broken or overridden scroll layout.
			const previousScroll = viewport.scrollLeft;
			const previousSnap = viewport.style.scrollSnapType;
			viewport.style.scrollSnapType = 'none';
			viewport.scrollLeft = previousScroll > 0 ? 0 : 1;
			pinned = Math.abs(viewport.scrollLeft - previousScroll) > 0.5;
			viewport.scrollLeft = previousScroll;
			viewport.style.scrollSnapType = previousSnap;
		}
		section.classList.toggle('rail-pinned', pinned);
		if (pinned && getComputedStyle(panel).position !== 'sticky') pinned = false;
		section.classList.toggle('rail-ready', pinned);
		section.classList.toggle('rail-pinned', pinned);
		if (pinned) {
			fallbackSize = '';
			section.style.setProperty('--rail-height', `${panel.offsetHeight + distance}px`);
			section.dataset.railDistance = String(distance);
		} else {
			fallbackSize = size;
			section.style.removeProperty('--rail-height');
			delete section.dataset.railDistance;
			window.scrollTo({ top: previousScrollY, behavior: 'instant' });
		}
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
	section.classList.add('rail-ready');
	const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
	resize?.observe(panel);
	resize?.observe(viewport);
	resize?.observe(track);
	// Older engines can measure on resize, loaded media, font readiness and content changes.
	section.addEventListener('load', measure, true);
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
	const stopListening = listenToMedia(media, measure);
	viewport.addEventListener('focusin', focus);
	viewport.addEventListener('scroll', report, { passive: true });
	void document.fonts?.ready.then(measure);
	measure();
	return {
		destroy() {
			destroyed = true;
			section.classList.remove('rail-ready', 'rail-pinned');
			cancelAnimationFrame(frame);
			resize?.disconnect();
			mutation.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', measure);
			stopListening();
			section.removeEventListener('load', measure, true);
			viewport.removeEventListener('focusin', focus);
			viewport.removeEventListener('scroll', report);
		}
	};
}

export function revealProject(card: HTMLElement) {
	const section = card.closest<HTMLElement>('.projects')!;
	if (!section.classList.contains('rail-ready')) {
		card.scrollIntoView({ block: 'start', behavior: 'instant' });
		return;
	}
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
