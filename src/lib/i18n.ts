import type { projects } from './projects';

const arabicHostname = 'xn--ngb2daclk.xn--ngbc5azd';
export const arabicUrl = `https://${arabicHostname}/`;

export type Locale = 'en' | 'ar';

export function localeFromHostname(hostname: string): Locale {
	return hostname === arabicHostname ? 'ar' : 'en';
}

export interface Messages {
	skip: string;
	home: string;
	greeting: string;
	intro: [string, string];
	navigation: string;
	projects: string;
	stations: string;
	projectStation: (name: string) => string;
	visit: string;
	visitNamed: (name: string) => string;
	source: string;
	clock: string;
	lyricsIntro: string;
	lyricsSeparator: string;
	lyricsLastSeparator: string;
	more: string;
	smaller: string;
	about: string;
	bio: [string, string];
	contact: string;
	discord: string;
	credit: string;
	top: string;
	mapAlt: string;
	mapLabel: string;
	explore: (name: string) => string;
	play: string;
	pause: string;
	github: string;
	starsTitle: string;
	starsScope: string;
	stars: (count: string) => string;
	followers: (count: string) => string;
}

export const messages: Record<Locale, Messages> = {
	en: {
		skip: 'Skip to projects',
		home: 'binimum, back to top',
		greeting: "hi. i'm",
		intro: ['I make stuff', 'that you might like.'],
		navigation: 'Main navigation',
		projects: 'Projects',
		stations: 'Project stations',
		projectStation: (name) => `Go to ${name}`,
		visit: 'Visit project',
		visitNamed: (name) => `Visit ${name}`,
		source: 'Source',
		clock: 'Live clock at time.binimum.org',
		lyricsIntro: 'My lyrics API, contributed to by the community. Used by',
		lyricsSeparator: ', ',
		lyricsLastSeparator: ', and ',
		more: 'More on GitHub',
		smaller: 'Smaller projects',
		about: 'About me',
		bio: [
			'👋 I’m binimum. I make stuff. (stuff = fullstack, utilities and small things that make me happy).',
			'Usually SvelteKit and TS. Sometimes Python or Rust. Regardless of language trying to make software that works well and feels good to use.'
		],
		contact: 'Get in touch',
		discord: 'Open Discord for @binimum (opens in a new tab)',
		credit: 'Inspired by',
		top: 'Back up',
		mapAlt: 'Project route map',
		mapLabel: 'Project map. Select a station to explore a project.',
		explore: (name) => `Explore ${name}`,
		play: 'Play sky video',
		pause: 'Pause sky video',
		github: 'binimum on GitHub (opens in a new tab)',
		starsTitle: 'Stars across binimum’s public repositories and Monochrome',
		starsScope: 'across binimum’s repositories and Monochrome',
		stars: (count) => `${count} stars`,
		followers: (count) => `${count} followers`
	},
	ar: {
		skip: 'انتقل إلى المشاريع',
		home: 'بنيموم، العودة إلى أعلى الصفحة',
		greeting: 'أهلاً، أنا',
		intro: ['أصنع أشياء', 'قد تعجبك.'],
		navigation: 'التنقّل الرئيسي',
		projects: 'المشاريع',
		stations: 'محطات المشاريع',
		projectStation: (name) => `انتقل إلى ${name}`,
		visit: 'زيارة المشروع',
		visitNamed: (name) => `زيارة ${name}`,
		source: 'الشيفرة المصدرية',
		clock: 'ساعة مباشرة على time.binimum.org',
		lyricsIntro: 'واجهة برمجة تطبيقات لكلمات الأغاني يساهم فيها المجتمع. تستخدمها تطبيقات',
		lyricsSeparator: '، ',
		lyricsLastSeparator: '، و',
		more: 'المزيد على GitHub',
		smaller: 'مشاريع أصغر',
		about: 'نبذة عني',
		bio: [
			'👋 أنا بنيموم. أُطوّر تطبيقات ويب متكاملة وأدوات وأشياء صغيرة تسعدني.',
			'أستخدم عادةً SvelteKit وTypeScript، وأحيانًا Python أو Rust. أيًا كانت اللغة، أحاول صنع برمجيات تعمل جيدًا ويسهل استخدامها.'
		],
		contact: 'تواصل معي',
		discord: 'افتح ديسكورد للتواصل مع @binimum (يفتح في تبويب جديد)',
		credit: 'مستوحى من',
		top: 'العودة إلى الأعلى',
		mapAlt: 'خريطة مسارات المشاريع',
		mapLabel: 'خريطة المشاريع. اختر محطة لاستكشاف أحد المشاريع.',
		explore: (name) => `استكشف ${name}`,
		play: 'تشغيل فيديو السماء',
		pause: 'إيقاف فيديو السماء مؤقتًا',
		github: 'بنيموم على GitHub (يفتح في تبويب جديد)',
		starsTitle: 'نجوم مستودعات بنيموم العامة ومشروع Monochrome',
		starsScope: 'في مستودعات بنيموم ومشروع Monochrome',
		stars: (count) => `النجوم: ${count}`,
		followers: (count) => `المتابعون: ${count}`
	}
};

type Project = (typeof projects)[number];
type FeaturedProject = Extract<Project, { small: false }>;

export const arabicProjectCopy: Record<
	Project['id'],
	{ name?: string; detail?: string; description?: string; technology?: string }
> &
	Record<FeaturedProject['id'], { description: string }> = {
	binilyrics: {
		name: 'lrc.red (سابقًا BiniLyrics)',
		description: 'كلمات الأغاني في تطبيقاتك المفضّلة.'
	},
	'am-lyrics': {
		description: 'تابع كل كلمة في وقتها.',
		technology: 'TypeScript · مكوّنات الويب',
		detail:
			'كلمات أغانٍ متزامنة على مستوى الكلمة في مكوّن ويب خفيف. أضفه إلى صفحتك ودع الموسيقى تتكفّل بالباقي.'
	},
	time: {
		description: 'ساعة تعرض الوقت بدقة.',
		detail:
			'ساعة ويب بسيطة مبنية باستخدام SvelteKit. تحصل على الوقت الدقيق عبر WebSocket على Cloudflare Workers، ويمكن تركها معروضة طوال اليوم.'
	},
	binilink: {
		detail:
			'واجهة برمجة تطبيقات توفّر البيانات الوصفية للمقاطع الموسيقية وتجد روابطها المطابقة على خدمات بث الموسيقى المختلفة.'
	},
	monochrome: { detail: 'مشغّل موسيقى مفتوح المصدر يدعم ملفات FLAC عالية الدقة.' },
	'tidal-ui': { detail: 'تطبيق ويب لبث الموسيقى مبني باستخدام SvelteKit. المشروع مؤرشف الآن.' },
	'browser-test': {
		detail:
			'اختبار للمتصفحات مكتوب بلغة TypeScript، يستلهم فكرة html5test ويقيّم المتصفحات بمعايير خاصة به.'
	},
	'live-bitrate-test': {
		detail: 'حمّل ملفًا صوتيًا وأعد ترميزه مباشرةً في المتصفح باستخدام معدّلات بت وترميزات مختلفة.'
	},
	'open-spotify-api': {
		detail:
			'واجهة مفتوحة للوصول إلى نقاط النهاية العامة في Spotify. الشيفرة وطريقة الاستخدام على GitHub.'
	}
};
