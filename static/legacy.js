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
				toggle.setAttribute('aria-label', video.paused ? 'Play sky video' : 'Pause sky video');
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
		var name = document.querySelector('.discord-name');
		var supported = typeof document.execCommand === 'function';
		if (name && supported) {
			var status = name.parentNode.querySelector('[role="status"]');
			var copy = document.createElement('button');
			copy.type = 'button';
			copy.className = 'discord';
			copy.innerHTML = 'Discord: @binimum &middot; Copy';
			copy.setAttribute('aria-label', 'Copy Discord username');
			copy.onclick = function () {
				var field = document.createElement('textarea');
				var previous = document.activeElement;
				var copied;
				field.value = 'binimum';
				field.setAttribute('readonly', '');
				field.style.cssText = 'position:fixed;left:0;top:0;opacity:0;';
				document.body.appendChild(field);
				field.select();
				try {
					copied = document.execCommand('copy');
				} catch (error) {
					copied = false;
				}
				document.body.removeChild(field);
				if (previous && previous.focus) previous.focus();
				copy.innerHTML = copied ? 'Copied @binimum' : 'Copy manually: @binimum';
				if (status)
					status.innerHTML = copied
						? 'Discord username copied.'
						: 'Could not copy. Username: binimum.';
				setTimeout(function () {
					copy.innerHTML = 'Discord: @binimum &middot; Copy';
				}, 2200);
			};
			name.parentNode.replaceChild(copy, name);
		}
	}
	if (document.readyState === 'loading') {
		if (document.addEventListener) document.addEventListener('DOMContentLoaded', enhance);
		else if (window.attachEvent) window.attachEvent('onload', enhance);
	} else enhance();
})();
