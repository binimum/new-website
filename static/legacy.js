/* Independent enhancements for browsers that cannot load the module client. */
(function () {
	if ('noModule' in document.createElement('script') || !document.querySelector) return;
	function enhance() {
		var sky = document.querySelector('.sky');
		var video = sky && sky.querySelector('video');
		if (
			video &&
			typeof video.play === 'function' &&
			typeof video.addEventListener === 'function' &&
			window.getComputedStyle &&
			getComputedStyle(sky).display !== 'none'
		) {
			var preference = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
			var paused = false;
			video.style.visibility = 'visible';
			var toggle = document.createElement('button');
			toggle.className = 'sky-toggle';
			toggle.type = 'button';
			sky.parentNode.appendChild(toggle);
			function label() {
				toggle.innerHTML = video.paused ? '&#9654;' : '&#10074;&#10074;';
				toggle.setAttribute('aria-label', sky.getAttribute(video.paused ? 'data-play-label' : 'data-pause-label'));
				toggle.setAttribute('aria-pressed', String(video.paused));
			}
			function sync() {
				var bounds = video.getBoundingClientRect();
				var reduce = preference && preference.matches;
				toggle.style.display = reduce ? 'none' : '';
				if (
					paused ||
					reduce ||
					document.hidden ||
					bounds.bottom <= 0 ||
					bounds.top >= innerHeight
				) {
					video.pause();
				} else {
					try {
						var playback = video.play();
						if (playback && typeof playback['catch'] === 'function') playback['catch'](label);
					} catch (error) {
						label();
					}
				}
				label();
			}
			toggle.onclick = function () {
				paused = !video.paused;
				sync();
			};
			video.addEventListener('play', label);
			video.addEventListener('pause', label);
			window.addEventListener('scroll', sync);
			window.addEventListener('resize', sync);
			document.addEventListener('visibilitychange', sync);
			if (preference && preference.addListener) preference.addListener(sync);
			sync();
		}

	}
	if (document.readyState === 'loading') {
		if (document.addEventListener) document.addEventListener('DOMContentLoaded', enhance);
		else if (window.attachEvent) window.attachEvent('onload', enhance);
	} else enhance();
})();
