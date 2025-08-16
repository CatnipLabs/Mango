export type { Locale } from "./data/locales";

// Public locale definition type for custom providers/locales
export type LocaleDefinition = import("./data/locales").Locale;

// Plugin types
export type { MangoPlugin, PluginContext } from "./plugins/types";
