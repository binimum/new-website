export function canCopyText() {
	if (typeof navigator.clipboard?.writeText === 'function') return true;
	// Some engines report copy as unsupported until there is a user gesture.
	return typeof document.execCommand === 'function';
}

export async function copyText(value: string) {
	if (typeof navigator.clipboard?.writeText === 'function') {
		await navigator.clipboard.writeText(value);
		return;
	}
	const previous = document.activeElement as HTMLElement | null;
	const selection = document.getSelection();
	const ranges = selection
		? Array.from({ length: selection.rangeCount }, (_, index) =>
				selection.getRangeAt(index).cloneRange()
			)
		: [];
	const field = document.createElement('textarea');
	field.value = value;
	field.readOnly = true;
	field.style.cssText = 'position:fixed;left:0;top:0;opacity:0;';
	document.body.appendChild(field);
	try {
		field.select();
		if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
	} finally {
		field.remove();
		previous?.focus();
		if (selection) {
			selection.removeAllRanges();
			for (const range of ranges) selection.addRange(range);
		}
	}
}
