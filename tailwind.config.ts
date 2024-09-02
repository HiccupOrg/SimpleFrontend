import { type Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import TailwindColors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'selector',

	theme: {
		extend: {
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Oxygen',
					'Ubuntu',
					'Cantarell',
					'Fira Sans',
					'Droid Sans',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol'
				],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'SF Mono',
					'Menlo',
					'Consolas',
					'Liberation Mono',
					'monospace'
				]
			},
			borderRadius: {
				none: '0',
				sm: '.125rem',
				DEFAULT: '.25rem',
				lg: '.5rem',
				full: '9999px'
			},
			opacity: {
				'0': '0',
				'20': '0.2',
				'40': '0.4',
				'60': '0.6',
				'80': '0.8',
				'100': '1'
			},
			width: {
				vfull: '100vw'
			},
			height: {
				vfull: '100vh'
			},
			colors: {
				primary: {
					DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
					...TailwindColors.indigo
				},
				secondary: {
					DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
					...TailwindColors.sky
				},
				background: 'rgb(var(--color-background) / <alpha-value>)',
				navbar: 'rgb(var(--color-navbar) / <alpha-value>)'
			},
			textColor: {
				default: {
					DEFAULT: 'rgb(var(--color-primary-text) / <alpha-value>)',
					...TailwindColors.slate
				}
			}
		}
	},

	plugins: [
		typography,
		plugin(({ addVariant, matchUtilities, theme }): void => {
			addVariant('hocus', ['&:hover', '&:focus']);
			// Square utility
			matchUtilities(
				{
					square: (value) => ({
						width: value,
						height: value
					})
				},
				{ values: theme('spacing') }
			);
		})
	]
} satisfies Config;
