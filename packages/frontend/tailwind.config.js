import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#3ab65a",
					disabled: "#7ff199",
				},
				secondary: "#144a2a",
			},
		},
	},
	darkMode: "class",
	plugins: [
		heroui({
			colors: {
				primary: "#3ab65a",
			},
		}),
	],
};
