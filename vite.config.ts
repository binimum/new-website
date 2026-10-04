import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Lower JavaScript syntax independently of the progressively enhanced CSS.
	build: {
		target: 'es2015',
		cssTarget: ['chrome28', 'firefox22', 'safari9', 'ie11']
	},
	plugins: [
		// Keep authored fallback declarations for Vite's broader CSS target.
		tailwindcss({ optimize: false }),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	]
});
