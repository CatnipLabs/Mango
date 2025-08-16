export type Locale = {
	readonly person: {
		readonly firstNames: readonly string[];
		readonly lastNames: readonly string[];
		readonly prefixes?: readonly string[];
		readonly suffixes?: readonly string[];
		readonly jobLevels?: readonly string[];
		readonly jobRoles?: readonly string[];
		readonly jobDomains?: readonly string[];
		readonly departments?: readonly string[];
	};
	readonly internet: {
		readonly emailDomains: readonly string[];
		readonly subdomains?: readonly string[];
		readonly statuses?: ReadonlyArray<{ code: number; text: string }>;
	};
	readonly address: {
		readonly streetPrefixes?: readonly string[]; // e.g., ["Rua", "Avenida"]
		readonly streetNames: readonly string[]; // base names
		readonly streetSuffixes?: readonly string[]; // e.g., ["St", "Ave"]
		readonly cities: readonly string[];
		readonly states: readonly { code: string; name: string }[];
		readonly zipFormat: string; // pattern using # as digit e.g., "#####" or "#####-###"
		readonly numberMin?: number; // default 1
		readonly numberMax?: number; // default 9999
	};
	readonly phone: {
		readonly formats: readonly string[]; // pattern using # as digit e.g., "(##) 9####-####"
	};
	readonly commerce: {
		readonly categories: readonly string[];
		readonly productNames: readonly string[];
		readonly currency?: string; // e.g., USD, BRL
		readonly priceMin?: number; // inclusive, default 1
		readonly priceMax?: number; // inclusive, default 1000
	};
};

export function resolveLocale(locale: Locale, fallback?: Locale): Locale {
	if (!fallback) return locale;
	// Shallow merge sections; arrays are used as-is if present, otherwise fall back.
	return {
		person: {
			firstNames: locale.person.firstNames ?? fallback.person.firstNames,
			lastNames: locale.person.lastNames ?? fallback.person.lastNames,
			prefixes: locale.person.prefixes ?? fallback.person.prefixes,
			suffixes: locale.person.suffixes ?? fallback.person.suffixes,
			jobLevels: locale.person.jobLevels ?? fallback.person.jobLevels,
			jobRoles: locale.person.jobRoles ?? fallback.person.jobRoles,
			jobDomains: locale.person.jobDomains ?? fallback.person.jobDomains,
			departments: locale.person.departments ?? fallback.person.departments,
		},
		internet: {
			emailDomains:
				locale.internet.emailDomains ?? fallback.internet.emailDomains,
			subdomains: locale.internet.subdomains ?? fallback.internet.subdomains,
			statuses: locale.internet.statuses ?? fallback.internet.statuses,
		},
		address: {
			streetPrefixes:
				locale.address.streetPrefixes ?? fallback.address.streetPrefixes,
			streetNames: locale.address.streetNames ?? fallback.address.streetNames,
			streetSuffixes:
				locale.address.streetSuffixes ?? fallback.address.streetSuffixes,
			cities: locale.address.cities ?? fallback.address.cities,
			states: locale.address.states ?? fallback.address.states,
			zipFormat: locale.address.zipFormat ?? fallback.address.zipFormat,
			numberMin: locale.address.numberMin ?? fallback.address.numberMin,
			numberMax: locale.address.numberMax ?? fallback.address.numberMax,
		},
		phone: {
			formats: locale.phone.formats ?? fallback.phone.formats,
		},
		commerce: {
			categories: locale.commerce.categories ?? fallback.commerce.categories,
			productNames:
				locale.commerce.productNames ?? fallback.commerce.productNames,
			currency: locale.commerce.currency ?? fallback.commerce.currency,
			priceMin: locale.commerce.priceMin ?? fallback.commerce.priceMin,
			priceMax: locale.commerce.priceMax ?? fallback.commerce.priceMax,
		},
	} as Locale;
}

export * from "./en_US";
export * from "./pt_BR";
