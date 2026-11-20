import { localeFromHostname } from '$lib/i18n';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = ({ url }) => ({
	locale: localeFromHostname(url.hostname)
});
