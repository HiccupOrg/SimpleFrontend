
export function updateDarkModeTheme(enableDarkMode?: boolean) {
	if (enableDarkMode !== undefined) {
		if (enableDarkMode) {
			localStorage.setItem('theme', '1');
		} else {
			localStorage.removeItem('theme');
		}
	}

	if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}
}
