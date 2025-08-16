import { describe, expect, it } from "vitest";
import {
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
	personPrefix,
	personSuffix,
} from "../src";
import { Random } from "../src/core/random";
import { en_US } from "../src/data/locales/en_US";

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

// Flexible job title regex: optional level + domain + role, each as one or more capitalized words
const jobRegex =
	/^([A-Z][a-z]+(?: [A-Z][a-z]+)* )?([A-Z][a-z]+(?: [A-Z][a-z]+)*) ([A-Z][a-z]+(?: [A-Z][a-z]+)*)$/;

describe("person corporate", () => {
	it("names and middle", () => {
		const rng = new Random(42);
		expect(firstName(rng, en_US)).toMatch(/[A-Za-z]+/);
		expect(lastName(rng, en_US)).toMatch(/[A-Za-z]+/);
		expect(fullName(rng, en_US)).toMatch(nameRegex);
		expect(middleName(rng, en_US)).toMatch(/[A-Za-z]+/);
		expect(nameWithMiddle(new Random(43), en_US)).toMatch(nameRegex);
		expect(nameWithMiddle(new Random(43), en_US, { initial: true })).toMatch(
			/^[A-Za-z]+ [A-Z]\. [A-Za-z]+$/,
		);
	});
	it("initials and formal", () => {
		const rng = new Random(7);
		expect(initials(rng, en_US)).toMatch(/^[A-Z]{2}$/);
		expect(
			initials(new Random(7), en_US, { includeMiddle: true, separator: "." }),
		).toMatch(/^[A-Z]\.[A-Z]\.[A-Z]$/);
		expect(formalName(new Random(8), en_US)).toMatch(/^[A-Za-z]+, [A-Za-z]+$/);
		expect(
			formalName(new Random(8), en_US, { includeMiddleInitial: true }),
		).toMatch(/^[A-Za-z]+, [A-Za-z]+ [A-Z]\.$/);
	});
	it("prefix/suffix and displayName", () => {
		const p = personPrefix(new Random(1), en_US);
		const s = personSuffix(new Random(2), en_US);
		expect(["Mr.", "Ms.", "Mx.", "Dr.", "Prof."]).toContain(p);
		expect(["Jr.", "Sr.", "II", "III", "PhD", "MBA"]).toContain(s);
		expect(displayName(new Random(9), en_US)).toMatch(/^[A-Za-z]+ [A-Za-z]+$/);
		expect(displayName(new Random(10), en_US, { style: "lastFirst" })).toMatch(
			/^[A-Za-z]+, [A-Za-z]+$/,
		);
	});
	it("job and department", () => {
		const jt = jobTitle(new Random(5), en_US);
		const dp = department(new Random(6), en_US);
		expect(jobRegex.test(jt)).toBe(true);
		expect(dp.length).toBeGreaterThan(0);
	});
	it("nameAndTitle", () => {
		const s = nameAndTitle(new Random(11), en_US);
		expect(s).toMatch(/ - /);
	});
});
