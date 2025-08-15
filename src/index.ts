export { en_US } from "./data/locales/en_US";
export { pt_BR } from "./data/locales/pt_BR";
export {
	city,
	fullAddress,
	state,
	street,
	streetNumber,
	zip,
} from "./generators/address";
export {
	category,
	price,
	priceWithCurrency,
	productName,
} from "./generators/commerce";
export {
	between as dateBetween,
	recent as dateRecent,
	soon as dateSoon,
} from "./generators/date";
export { generateMany, multiple } from "./generators/helpers";
export { email } from "./generators/internet";
export { firstName, fullName, lastName } from "./generators/person";
export { phone } from "./generators/phone";

import { Random } from "./core/random";
import { resolveLocale } from "./data/locales";
import { en_US as defaultLocale } from "./data/locales/en_US";
import {
	city as _city,
	fullAddress as _fullAddress,
	state as _state,
	street as _street,
	streetNumber as _streetNumber,
	zip as _zip,
} from "./generators/address";
import {
	category as _category,
	price as _price,
	priceWithCurrency as _priceWithCurrency,
	productName as _productName,
} from "./generators/commerce";
import {
	between as _between,
	recent as _recent,
	soon as _soon,
} from "./generators/date";
import { email as _email } from "./generators/internet";
import {
	firstName as _firstName,
	fullName as _fullName,
	lastName as _lastName,
} from "./generators/person";
import { phone as _phone } from "./generators/phone";
import type { Locale } from "./types";

export class Mango {
	private rng: Random;
	private locale: Locale;
	private fallback: Locale | undefined;
	constructor(opts?: {
		seed?: number;
		locale?: Locale;
		fallbackLocale?: Locale;
	}) {
		this.rng = new Random(opts?.seed ?? 0xc0ffee);
		this.locale = opts?.locale ?? defaultLocale;
		this.fallback = opts?.fallbackLocale;
	}
	setSeed(seed: number) {
		this.rng.seed(seed);
	}
	setLocale(locale: Locale, fallbackLocale?: Locale) {
		this.locale = locale;
		if (fallbackLocale) this.fallback = fallbackLocale;
	}
	setFallbackLocale(fallbackLocale?: Locale) {
		this.fallback = fallbackLocale;
	}
	private L(): Locale {
		return this.fallback
			? resolveLocale(this.locale, this.fallback)
			: this.locale;
	}

	person = {
		firstName: () => _firstName(this.rng, this.L()),
		lastName: () => _lastName(this.rng, this.L()),
		fullName: () => _fullName(this.rng, this.L()),
	};
	internet = {
		email: () => _email(this.rng, this.L()),
	};
	address = {
		street: () => _street(this.rng, this.L()),
		streetNumber: () => _streetNumber(this.rng, this.L()),
		city: () => _city(this.rng, this.L()),
		state: () => _state(this.rng, this.L()),
		zip: () => _zip(this.rng, this.L()),
		full: () => _fullAddress(this.rng, this.L()),
	};
	phone = { phone: () => _phone(this.rng, this.L()) };
	date = {
		between: (start?: Date, end?: Date) => _between(this.rng, start, end),
		recent: (days?: number) => _recent(this.rng, days),
		soon: (days?: number) => _soon(this.rng, days),
	};
	commerce = {
		category: () => _category(this.rng, this.L()),
		productName: () => _productName(this.rng, this.L()),
		price: (opts?: { min?: number; max?: number; decimals?: number }) =>
			_price(this.rng, this.L(), opts),
		priceWithCurrency: (opts?: {
			min?: number;
			max?: number;
			decimals?: number;
		}) => _priceWithCurrency(this.rng, this.L(), opts),
	};
}
export const mango = new Mango();
