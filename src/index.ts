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
	currencyCode,
	ean13,
	invoiceNumber,
	price,
	priceWithCurrency,
	productName,
	purchaseOrderNumber,
	quantity,
	sku,
	transactionId,
	upc,
} from "./generators/commerce";
export {
	between as dateBetween,
	recent as dateRecent,
	soon as dateSoon,
} from "./generators/date";
export { generateMany, multiple } from "./generators/helpers";
export {
	bigInteger,
	bigSerial,
	cuid,
	identity,
	integer,
	nanoid,
	objectId,
	serial,
	shortUUID,
	smallInt,
	smallSerial,
	ulid,
	uuidV4,
} from "./generators/ids";
export {
	companyEmail,
	domain,
	email,
	httpMethod,
	httpStatus,
	ipv4,
	ipv6,
	mac,
	password,
	port,
	safeEmail,
	url,
	username,
} from "./generators/internet";
export {
	department,
	displayName,
	firstName,
	formalName,
	fullName,
	initials,
	jobTitle,
	lastName,
	middleName,
	nameAndTitle,
	nameWithMiddle,
	prefix as personPrefix,
	suffix as personSuffix,
} from "./generators/person";
export { phone } from "./generators/phone";
export { definePlugin } from "./plugins/types";

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
	currencyCode as _currencyCode,
	ean13 as _ean13,
	invoiceNumber as _invoiceNumber,
	price as _price,
	priceWithCurrency as _priceWithCurrency,
	productName as _productName,
	purchaseOrderNumber as _purchaseOrderNumber,
	quantity as _quantity,
	sku as _sku,
	transactionId as _transactionId,
	upc as _upc,
} from "./generators/commerce";
import {
	between as _between,
	recent as _recent,
	soon as _soon,
} from "./generators/date";
import {
	bigInteger as _bigInteger,
	bigSerial as _bigSerial,
	cuid as _cuid,
	identity as _identity,
	integer as _integer,
	nanoid as _nanoid,
	objectId as _objectId,
	serial as _serial,
	shortUUID as _shortUUID,
	smallInt as _smallInt,
	smallSerial as _smallSerial,
	ulid as _ulid,
	uuidV4 as _uuidV4,
} from "./generators/ids";
import {
	companyEmail as _companyEmail,
	domain as _domain,
	email as _email,
	httpMethod as _httpMethod,
	httpStatus as _httpStatus,
	ipv4 as _ipv4,
	ipv6 as _ipv6,
	mac as _mac,
	password as _password,
	port as _port,
	safeEmail as _safeEmail,
	url as _url,
	username as _username,
} from "./generators/internet";
import {
	department as _department,
	displayName as _displayName,
	firstName as _firstName,
	formalName as _formalName,
	fullName as _fullName,
	initials as _initials,
	jobTitle as _jobTitle,
	lastName as _lastName,
	middleName as _middleName,
	nameAndTitle as _nameAndTitle,
	nameWithMiddle as _nameWithMiddle,
	prefix as _personPrefix,
	suffix as _personSuffix,
} from "./generators/person";
import { phone as _phone } from "./generators/phone";
import type { MangoPlugin } from "./plugins/types";
import type { Locale } from "./types";

export class Mango {
	private rng: Random;
	private locale: Locale;
	private fallback: Locale | undefined;
	/** Registered plugin APIs, keyed by plugin name */
	public readonly plugins: Record<string, unknown> = {};
	/** Plugin APIs keyed by plugin reference for typed retrieval */
	private readonly _pluginByRef = new Map<MangoPlugin<unknown>, unknown>();
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

	/** Register a plugin and expose its API under mango.plugins[plugin.name] */
	use<TApi>(plugin: MangoPlugin<TApi>): this {
		if (this.plugins[plugin.name]) return this; // idempotent
		const api = plugin.install({
			rng: this.rng,
			getLocale: () => this.L(),
			setLocale: (loc: Locale) => this.setLocale(loc),
		});
		this.plugins[plugin.name] = api as unknown;
		this._pluginByRef.set(plugin, api as unknown);
		return this;
	}

	/**
	 * Get the typed API for a plugin. Auto-installs if not present.
	 * Usage: const api = mango.plugin(myPlugin)
	 */
	plugin<TApi>(plugin: MangoPlugin<TApi>): TApi {
		if (!this.plugins[plugin.name]) this.use(plugin);
		const api = this._pluginByRef.get(plugin) as TApi | undefined;
		if (api === undefined) {
			// Fallback: install again to obtain API, then store
			const freshlyInstalled = plugin.install({
				rng: this.rng,
				getLocale: () => this.L(),
				setLocale: (loc: Locale) => this.setLocale(loc),
			}) as unknown as TApi;
			this.plugins[plugin.name] = freshlyInstalled as unknown;
			this._pluginByRef.set(
				plugin as unknown as MangoPlugin<unknown>,
				freshlyInstalled as unknown,
			);
			return freshlyInstalled;
		}
		return api;
	}

	person = {
		firstName: () => _firstName(this.rng, this.L()),
		lastName: () => _lastName(this.rng, this.L()),
		fullName: () => _fullName(this.rng, this.L()),
		middleName: () => _middleName(this.rng, this.L()),
		nameWithMiddle: (opts?: { initial?: boolean }) =>
			_nameWithMiddle(this.rng, this.L(), opts),
		initials: (opts?: { includeMiddle?: boolean; separator?: string }) =>
			_initials(this.rng, this.L(), opts),
		prefix: () => _personPrefix(this.rng, this.L()),
		suffix: () => _personSuffix(this.rng, this.L()),
		formalName: (opts?: { includeMiddleInitial?: boolean }) =>
			_formalName(this.rng, this.L(), opts),
		displayName: (opts?: {
			style?:
				| "firstLast"
				| "lastFirst"
				| "firstInitialLast"
				| "firstLastInitial";
		}) => _displayName(this.rng, this.L(), opts),
		jobTitle: (opts?: { includeLevel?: boolean }) =>
			_jobTitle(this.rng, this.L(), opts),
		department: () => _department(this.rng, this.L()),
		nameAndTitle: () => _nameAndTitle(this.rng, this.L()),
	};
	internet = {
		email: () => _email(this.rng, this.L()),
		companyEmail: (opts?: {
			domain?: string;
			pattern?: "first.last" | "flast" | "first" | "last";
			separator?: string;
		}) => _companyEmail(this.rng, this.L(), opts),
		username: (opts?: {
			style?: "first.last" | "first_last" | "flast" | "first";
		}) => _username(this.rng, this.L(), opts),
		domain: (opts?: { subdomain?: boolean }) =>
			_domain(this.rng, this.L(), opts),
		url: (opts?: {
			https?: boolean;
			subdomain?: boolean;
			pathSegments?: number;
		}) => _url(this.rng, this.L(), opts),
		ipv4: () => _ipv4(this.rng),
		ipv6: () => _ipv6(this.rng),
		mac: () => _mac(this.rng),
		httpMethod: () => _httpMethod(this.rng),
		httpStatus: (opts?: { group?: 2 | 3 | 4 | 5 }) =>
			_httpStatus(this.rng, this.L(), opts),
		password: (opts?: {
			length?: number;
			upper?: boolean;
			lower?: boolean;
			digits?: boolean;
			symbols?: boolean;
		}) => _password(this.rng, opts),
		port: (opts?: { min?: number; max?: number }) => _port(this.rng, opts),
		safeEmail: (opts?: {
			domain?: "example.com" | "example.org" | "example.net";
		}) => _safeEmail(this.rng, opts),
	};
	/** ID/identifier utilities */
	ids = {
		uuidV4: () => _uuidV4(this.rng),
		ulid: (opts?: { time?: number }) => _ulid(this.rng, opts),
		nanoid: (opts?: { length?: number; alphabet?: string }) =>
			_nanoid(this.rng, opts),
		objectId: (opts?: { time?: number }) => _objectId(this.rng, opts),
		shortUUID: () => _shortUUID(this.rng),
		smallInt: (opts?: { signed?: boolean; min?: number; max?: number }) =>
			_smallInt(this.rng, opts),
		integer: (opts?: { signed?: boolean; min?: number; max?: number }) =>
			_integer(this.rng, opts),
		bigInteger: (opts?: { min?: bigint | number; max?: bigint | number }) =>
			_bigInteger(this.rng, opts),
		smallSerial: () => _smallSerial(this.rng),
		serial: () => _serial(this.rng),
		bigSerial: () => _bigSerial(this.rng),
		identity: (opts?: {
			mode?: "ALWAYS" | "BY DEFAULT";
			type?: "smallint" | "integer" | "bigint";
		}) => _identity(this.rng, opts),
		cuid: (opts?: { length?: number }) => _cuid(this.rng, opts),
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
		quantity: (opts?: { min?: number; max?: number }) =>
			_quantity(this.rng, opts),
		sku: (opts?: { pattern?: string }) => _sku(this.rng, opts),
		upc: () => _upc(this.rng),
		ean13: () => _ean13(this.rng),
		purchaseOrderNumber: (opts?: { prefix?: string }) =>
			_purchaseOrderNumber(this.rng, opts),
		invoiceNumber: (opts?: { prefix?: string }) =>
			_invoiceNumber(this.rng, opts),
		transactionId: (length?: number) =>
			_transactionId(this.rng, length !== undefined ? { length } : undefined),
		currencyCode: () => _currencyCode(this.L()),
	};
}
export const mango = new Mango();
