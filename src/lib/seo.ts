export const seo = {
	url: 'https://binimum.org/',
	title: 'a world of binimum',
	description:
		'i make cool stuff. come take a look. (stuff = fullstack, utilities and small things that make me happy).',
	image: 'https://binimum.org/og.jpg',
	imageAlt: 'Blue sky and sunshine above “hi. i’m binimum” and “I make stuff that you might like.”'
};

const structuredData = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${seo.url}#website`,
			url: seo.url,
			name: 'binimum',
			alternateName: 'a world of binimum',
			inLanguage: 'en',
			publisher: { '@id': `${seo.url}#person` }
		},
		{
			'@type': 'WebPage',
			'@id': seo.url,
			url: seo.url,
			name: seo.title,
			description: seo.description,
			inLanguage: 'en',
			isPartOf: { '@id': `${seo.url}#website` },
			about: { '@id': `${seo.url}#person` },
			primaryImageOfPage: {
				'@type': 'ImageObject',
				url: seo.image,
				width: 1200,
				height: 630
			}
		},
		{
			'@type': 'Person',
			'@id': `${seo.url}#person`,
			name: 'binimum',
			url: seo.url,
			description:
				'I make fullstack projects, utilities, music tools, and small things that make me happy.',
			sameAs: ['https://github.com/binimum']
		}
	]
};

// Escape markup delimiters before emitting JSON into an HTML script element.
export const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`;
