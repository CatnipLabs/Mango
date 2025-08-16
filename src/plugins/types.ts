import type { Random } from "../core/random";
import type { Locale } from "../types";

export interface PluginContext {
	readonly rng: Random;
	/** Returns the effective locale (with fallback applied if set) */
	getLocale(): Locale;
	/** Sets the primary locale */
	setLocale(locale: Locale): void;
}

export interface MangoPlugin<TApi = unknown> {
	/** Unique plugin name. Used as key on mango.plugins */
	name: string;
	/** Install hook. Return the plugin API that will be exposed at mango.plugins[name] */
	install(ctx: PluginContext): TApi;
}

/** Helper to define a plugin with preserved type information */
export function definePlugin<TApi>(
	plugin: MangoPlugin<TApi>,
): MangoPlugin<TApi> {
	return plugin;
}
