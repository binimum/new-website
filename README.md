# binimum

a svkit portfolio inspired by Legible Prague. TS + Bun.

## dev

```sh
bun install
bun run dev
```

## check and build

```sh
bun run check
bun run lint
bun run build
bun run preview
```

## browser compatibility

Styles build up by capability rather than browser version. The ordinary baseline stylesheet includes route colours, a sky image, project previews and a raster route map even without feature queries or JavaScript. Feature queries add the detailed design; literal colours work without CSS variables, block flow covers missing layout support, Flexbox adds alignment and Grid adds columns. Fixed sizes, physical offsets, native focus styles and transform animations cover older engines, while fluid sizes and newer CSS effects enhance browsers that support them.

The client build lowers syntax to ES2015 across browser families. This is a syntax target, not a promise that every ES2015 browser runs Svelte: hydration still needs native modules/dynamic import and Svelte's runtime APIs such as Proxy. See [Vite browser compatibility](https://vite.dev/guide/build#browser-compatibility) and [Svelte browser requirements](https://svelte.dev/docs/svelte/v5-migration-guide#Breaking-changes-Minimum-browser-versions). Content, links and styling work independently of hydration.

Small runtime bridges cover `globalThis`, `queueMicrotask`, `Object.fromEntries`, `String.prototype.replaceAll`, `Promise.prototype.finally` and `Event.prototype.composedPath`. The local [IntersectionObserver polyfill](https://github.com/GoogleChromeLabs/intersection-observer) loads only when the native API is missing or incomplete; its W3C license is in `static/licenses`. Media preferences support both current event listeners and older `addListener` implementations. GitHub statistics check optional APIs before fetching. The rail verifies scrolling, sticky positioning and available height; without ResizeObserver it measures on resize, loaded media, fonts and content changes, and still falls back to the styled grid/list when needed.

Browsers without native modules receive a small classic script for video playback controls and clipboard copying where those APIs work. Module-capable browsers use the Svelte client, whose clipboard control also falls back to selection-based copying. Native project links do not depend on either script.

Browsers supporting `font-tech(variations)` use the original variable Manrope font. Older engines use static 400, 500 and 650 instances in WOFF2 or WOFF to avoid incorrect glyph spacing in early variable-font implementations. All instances retain the Manrope OFL license in `static/licenses`. Image previews use WebP with JPEG fallbacks. The oldest-browser route-map JPEG is a static rendering of the desktop SVG and should be refreshed when that diagram changes.
