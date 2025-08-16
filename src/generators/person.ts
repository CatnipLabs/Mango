import type { Random } from "../core/random";
import type { Locale } from "../types";

export function firstName(rng: Random, locale: Locale): string {
	const arr = locale.person.firstNames;
	return arr[rng.int(0, arr.length - 1)];
}
export function lastName(rng: Random, locale: Locale): string {
	const arr = locale.person.lastNames;
	return arr[rng.int(0, arr.length - 1)];
}
export function fullName(rng: Random, locale: Locale): string {
	return `${firstName(rng, locale)} ${lastName(rng, locale)}`;
}

/** Middle name defaults to firstNames pool when a dedicated pool doesn't exist. */
export function middleName(rng: Random, locale: Locale): string {
	const arr = locale.person.firstNames;
	return arr[rng.int(0, arr.length - 1)];
}

export function nameWithMiddle(
	rng: Random,
	locale: Locale,
	opts?: { initial?: boolean },
): string {
	const first = firstName(rng, locale);
	const middle = middleName(rng, locale);
	const last = lastName(rng, locale);
	if (opts?.initial) return `${first} ${middle[0].toUpperCase()}. ${last}`;
	return `${first} ${middle} ${last}`;
}

export function initials(
	rng: Random,
	locale: Locale,
	opts?: { includeMiddle?: boolean; separator?: string },
): string {
	const sep = opts?.separator ?? "";
	const firstInitial = firstName(rng, locale)[0]?.toUpperCase() ?? "";
	const lastInitial = lastName(rng, locale)[0]?.toUpperCase() ?? "";
	if (opts?.includeMiddle) {
		const middleInitial = middleName(rng, locale)[0]?.toUpperCase() ?? "";
		return [firstInitial, middleInitial, lastInitial].join(sep);
	}
	return [firstInitial, lastInitial].join(sep);
}

export function prefix(rng: Random, locale: Locale): string {
	const arr = locale.person.prefixes ?? ["Mr.", "Ms.", "Mx.", "Dr.", "Prof."];
	return arr[rng.int(0, arr.length - 1)];
}
export function suffix(rng: Random, locale: Locale): string {
	const arr = locale.person.suffixes ?? [
		"Jr.",
		"Sr.",
		"II",
		"III",
		"PhD",
		"MBA",
	];
	return arr[rng.int(0, arr.length - 1)];
}

export function formalName(
	rng: Random,
	locale: Locale,
	opts?: { includeMiddleInitial?: boolean },
): string {
	const first = firstName(rng, locale);
	const last = lastName(rng, locale);
	if (opts?.includeMiddleInitial) {
		const middleInitial = middleName(rng, locale)[0]?.toUpperCase() ?? "";
		return `${last}, ${first} ${middleInitial}.`;
	}
	return `${last}, ${first}`;
}

export function displayName(
	rng: Random,
	locale: Locale,
	opts?: {
		style?: "firstLast" | "lastFirst" | "firstInitialLast" | "firstLastInitial";
	},
): string {
	const style = opts?.style ?? "firstLast";
	const first = firstName(rng, locale);
	const last = lastName(rng, locale);
	const firstInitial = first[0]?.toUpperCase() ?? "";
	const lastInitial = last[0]?.toUpperCase() ?? "";
	switch (style) {
		case "lastFirst":
			return `${last}, ${first}`;
		case "firstInitialLast":
			return `${firstInitial}. ${last}`;
		case "firstLastInitial":
			return `${first} ${lastInitial}.`;
		default:
			return `${first} ${last}`;
	}
}

export function jobTitle(
	rng: Random,
	locale: Locale,
	opts?: { includeLevel?: boolean },
): string {
	const roles = locale.person.jobRoles ?? [
		"Engineer",
		"Analyst",
		"Manager",
		"Director",
		"Administrator",
		"Specialist",
		"Consultant",
		"Coordinator",
		"Executive",
		"Architect",
		"Scientist",
	];
	const domains = locale.person.jobDomains ?? [
		"Software",
		"Data",
		"Security",
		"Finance",
		"HR",
		"Marketing",
		"Sales",
		"Operations",
		"Product",
		"Support",
		"IT",
		"DevOps",
		"Cloud",
		"Infrastructure",
	];
	const levels = locale.person.jobLevels ?? [
		"Junior",
		"Mid",
		"Senior",
		"Lead",
		"Principal",
		"Chief",
	];
	const role = roles[rng.int(0, roles.length - 1)];
	const domain = domains[rng.int(0, domains.length - 1)];
	const includeLevel = opts?.includeLevel ?? rng.int(0, 1) === 1;
	const level = includeLevel ? `${levels[rng.int(0, levels.length - 1)]} ` : "";
	return `${level}${domain} ${role}`;
}

export function department(rng: Random, locale: Locale): string {
	const arr = locale.person.departments ?? [
		"Engineering",
		"Finance",
		"Human Resources",
		"Marketing",
		"Sales",
		"Operations",
		"Product",
		"Customer Support",
		"IT",
		"Legal",
		"Procurement",
		"R&D",
		"Customer Success",
		"Administration",
	];
	return arr[rng.int(0, arr.length - 1)];
}

export function nameAndTitle(rng: Random, locale: Locale): string {
	return `${fullName(rng, locale)} - ${jobTitle(rng, locale)}`;
}
