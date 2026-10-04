/** Modern and older MediaQueryList implementations both report preference changes. */
export function listenToMedia(query: MediaQueryList, listener: () => void) {
	if (typeof query.addEventListener === 'function') {
		query.addEventListener('change', listener);
		return () => query.removeEventListener('change', listener);
	}
	if (typeof query.addListener === 'function') {
		query.addListener(listener);
		return () => query.removeListener(listener);
	}
	return () => {};
}
