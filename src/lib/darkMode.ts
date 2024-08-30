import { browser } from '$app/environment';

export function updateDarkModeTheme(enableDarkMode?: boolean) {
	if (browser) {
		const { localStorage } = window;

		if (enableDarkMode !== undefined) {
			if (enableDarkMode) {
				localStorage.setItem('theme', 'dark');
			} else {
				localStorage.setItem('theme', 'light');
			}
		}

		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
}

export function getCurrentColorMode(): 'light' | 'dark' {
	if (browser) {
		const { localStorage } = window;
		return localStorage.theme || 'light';
	}
	return 'light';
}
