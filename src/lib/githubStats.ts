export type GitHubStats = { stars: number; followers: number; updatedAt: number };
type Repository = { id: number; stargazers_count: number };

export function validStats(value: unknown): value is GitHubStats {
	if (!value || typeof value !== 'object') return false;
	const stats = value as GitHubStats;
	return [stats.stars, stats.followers, stats.updatedAt].every(
		(number) => Number.isSafeInteger(number) && number >= 0
	);
}

export async function fetchGitHubStats(signal: AbortSignal): Promise<GitHubStats> {
	async function get<T>(path: string): Promise<T> {
		const response = await fetch(`https://api.github.com/${path}`, {
			signal,
			headers: { Accept: 'application/vnd.github+json' }
		});
		if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
		return response.json();
	}
	const [user, firstPage, monochrome] = await Promise.all([
		get<{ followers: number }>('users/binimum'),
		get<Repository[]>('users/binimum/repos?type=owner&per_page=100&page=1'),
		get<Repository>('repos/monochrome-music/monochrome')
	]);
	const repositories = new Map<number, number>();
	function add(repo: Repository) {
		if (
			!Number.isSafeInteger(repo.id) ||
			!Number.isSafeInteger(repo.stargazers_count) ||
			repo.stargazers_count < 0
		)
			throw new Error('Invalid repository statistics');
		repositories.set(repo.id, repo.stargazers_count);
	}
	let page = firstPage;
	let pageNumber = 1;
	while (true) {
		page.forEach(add);
		if (page.length < 100) break;
		page = await get<Repository[]>(
			`users/binimum/repos?type=owner&per_page=100&page=${++pageNumber}`
		);
	}
	add(monochrome);
	const stats = {
		stars: [...repositories.values()].reduce((total, count) => total + count, 0),
		followers: user.followers,
		updatedAt: Date.now()
	};
	if (!validStats(stats)) throw new Error('Invalid GitHub statistics');
	return stats;
}
