import type { Config } from "tailwindcss";
import jsConfig from "./tailwind.config.js";

// TypeScript wrapper around the JavaScript config
const config: Config = jsConfig;

export default config;
