import { localeFromHostname } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	if (event.route.id !== '/' || localeFromHostname(event.url.hostname) === 'en') {
		return resolve(event);
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html lang="en">', '<html lang="ar" dir="rtl">')
	});
};
