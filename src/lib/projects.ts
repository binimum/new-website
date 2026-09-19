export type Category = 'All' | 'Music' | 'Tools';

// Descriptions and destinations verified against github.com/binimum, September 2026.
export const projects = [
	{
		id: 'binilyrics',
		name: 'BiniLyrics',
		category: 'Music',
		description: 'Lyrics used in the apps you love.',
		detail: 'My lyrics API, contributed to by the community. Used by Better Lyrics, Metrolist, Monochrome, and <am-lyrics>.',
		technology: 'libSQL · API',
		url: null,
		live: 'https://lyrics.binimum.org',
		preview: 'binilyrics',
		small: false
	},
	{
		id: 'am-lyrics',
		small: false,
		name: 'am-lyrics',
		category: 'Music',
		description: 'Every word, right on time.',
		detail:
			'Word-synced lyrics in a lightweight Web Component. Drop it into a page and let the music do the rest.',
		technology: 'TS · Web Components',
		url: 'https://github.com/binimum/am-lyrics',
		live: 'https://lyrics.binimum.org',
		preview: 'lyrics'
	},
	{
		id: 'time',
		small: false,
		name: 'time.binimum.org',
		category: 'Tools',
		description: 'The time. But it\'s pretty accurate.',
		detail:
			'Minimalistic web clock built with SvelteKit. WS on a CF Worker provide accurate time. Suitable to be left on a screen for a whole day.',
		technology: 'SvelteKit',
		url: 'https://github.com/binimum/time.okit.works',
		live: 'https://time.binimum.org',
		preview: 'clock'
	},
	{
		id: 'monochrome',
		small: true,
		name: 'Monochrome',
		category: 'Music',
		description: 'Music, without the clutter.',
		detail: 'An open-source music player.',
		technology: 'HTML · JS',
		url: 'https://github.com/monochrome-music/monochrome',
		live: 'https://monochrome.tf',
		preview: 'monochrome'
	},
	{
		id: 'tidal-ui',
		small: true,
		name: 'tidal-ui',
		category: 'Music',
		description: 'An webapp for Hi-Fi listening.',
		detail:
			'A music streaming frontend built with SvelteKit. Now archived, with the source still available to explore.',
		technology: 'SvelteKit · Tailwind CSS',
		url: 'https://github.com/binimum/tidal-ui',
		live: null,
		preview: 'music'
	},
	{
		id: 'browser-test',
		small: true,
		name: 'browser-test',
		category: 'Tools',
		description: 'A highly opinionated browser test.',
		detail:
			'An experiment in putting browsers through their paces. Written in TypeScript, with opinions included.',
		technology: 'TypeScript',
		url: 'https://github.com/binimum/browser-test',
		live: null,
		preview: 'browser'
	},
	{
		id: 'live-bitrate-test',
		small: true,
		name: 'live-bitrate-test',
		category: 'Music',
		description: 'Different codecs. Same pair of ears.',
		detail:
			'Load an audio file and re-encode it at different bitrates, live in the browser. A small experiment in what you can actually hear.',
		technology: 'HTML · JavaScript',
		url: 'https://github.com/binimum/live-bitrate-test',
		live: 'https://binimum.github.io/live-bitrate-test/',
		preview: 'audio'
	},
	{
		id: 'open-spotify-api',
		small: true,
		name: 'open-spotify-api',
		category: 'Tools',
		description: 'A way into Spotify’s public endpoints.',
		detail:
			'An open API for accessing public Spotify endpoints. The code and usage details live on GitHub.',
		technology: 'JavaScript',
		url: 'https://github.com/binimum/open-spotify-api',
		live: null,
		preview: 'api'
	}
] as const;
