import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.test.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	setupFiles: ["./.env.test"],
};

export default config;
