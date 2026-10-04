import 'svelte/elements';

declare module 'svelte/elements' {
	// Svelte types SVG anchors as HTML anchors; older SVG engines need both attributes.
	interface HTMLAnchorAttributes {
		'xlink:href'?: string;
	}
}
