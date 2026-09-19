# binimum

A SvelteKit portfolio inspired by Prague’s wayfinding system. Built with TypeScript and Bun.

## Develop

```sh
bun install
bun run dev
```

## Check and build

```sh
bun run check
bun run lint
bun run build
bun run preview
```

The homepage is prerendered. The existing automatic adapter is retained; configure an adapter for your hosting platform when deploying.

## Edit

- `src/lib/projects.ts`: project descriptions, categories, GitHub URLs, and live links.
- `src/lib/RouteMap.svelte`: desktop and mobile station layouts. Station IDs match project IDs.
- `src/routes/+page.svelte`: page content, filtering, expandable project details, and contact links.
- `src/routes/layout.css`: colours, typography, responsive layouts, and interaction styles.

Project links and descriptions were checked against [binimum’s public GitHub repositories](https://github.com/binimum?tab=repositories) in September 2026. Project graphics are custom illustrations, not screenshots. The clock illustration displays the visitor’s local time.

Map stops link directly to project sections; URLs such as `/#project-am-lyrics` also open the relevant project. Contact uses email and a copyable Discord username, with a manual-copy fallback.

## Font and sky

Manrope is served locally from `static/fonts/manrope-latin-variable.woff2`, with its SIL Open Font License in `static/licenses/Manrope-OFL.txt`. Source: [Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope). No requests to Google Fonts are made by visitors.

The header uses your original `static/bg/sky.webm`, with `sky.mp4` as a fallback and `sky-poster.webp` as the still image. Files are served unchanged. Playback loops forward, pauses when offscreen or in a background tab, and respects the pause button and reduced-motion preferences. No re-encoding or reverse-seeking is used.

`src/lib/GitHubLink.svelte` contains the GitHub mark with an integrated outbound arrow. The favicon is a northeast arrow in `#6d89de`.
