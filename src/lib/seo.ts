import { arabicUrl, type Locale } from './i18n';

const image = 'https://binimum.org/og.jpg';

export const seoByLocale = {
	en: {
		url: 'https://binimum.org/',
		title: 'a world of binimum',
		description:
			'i make cool stuff. come take a look. (stuff = fullstack, utilities and small things that make me happy).',
		about:
			'I make fullstack projects, utilities, music tools, and small things that make me happy.',
		ogLocale: 'en_GB',
		image,
		imageAlt:
			'Blue sky and sunshine above “hi. i’m binimum” and “I make stuff that you might like.”'
	},
	ar: {
		url: arabicUrl,
		title: 'عالم بنيموم',
		description: 'أُطوّر تطبيقات ويب متكاملة وأدوات وأشياء صغيرة تسعدني. تفضّل بإلقاء نظرة.',
		about: 'أُطوّر تطبيقات ويب متكاملة وأدوات موسيقية وأشياء صغيرة تسعدني.',
		ogLocale: 'ar_001',
		image,
		imageAlt: 'سماء زرقاء وأشعة شمس فوق تحية بنيموم: «أهلاً، أنا بنيموم. أصنع أشياء قد تعجبك.»'
	}
};

export function structuredDataScript(locale: Locale): string {
	const seo = seoByLocale[locale];
	const personId = `${seoByLocale.en.url}#person`;
	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${seo.url}#website`,
				url: seo.url,
				name: 'binimum',
				alternateName: seo.title,
				inLanguage: locale,
				publisher: { '@id': personId }
			},
			{
				'@type': 'WebPage',
				'@id': seo.url,
				url: seo.url,
				name: seo.title,
				description: seo.description,
				inLanguage: locale,
				isPartOf: { '@id': `${seo.url}#website` },
				about: { '@id': personId },
				primaryImageOfPage: { '@type': 'ImageObject', url: seo.image, width: 1200, height: 630 }
			},
			{
				'@type': 'Person',
				'@id': personId,
				name: 'binimum',
				url: seoByLocale.en.url,
				description: seo.about,
				sameAs: ['https://github.com/binimum']
			}
		]
	};

	// Escape markup delimiters before emitting JSON into an HTML script element.
	return `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`;
}
