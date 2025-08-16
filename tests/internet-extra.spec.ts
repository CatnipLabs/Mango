import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { en_US } from "../src/data/locales/en_US";
import { uuidV4 } from "../src/generators/ids";
import {
	companyEmail,
	domain,
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
} from "../src/generators/internet";

const emailRegex = /^[a-z0-9]+(?:[._][a-z0-9]+)*@[a-z0-9.-]+\.[a-z]{2,}$/;
const ipv4Re = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const macRe = /^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/;
const uuidRe =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("internet (extra)", () => {
	it("companyEmail and username", () => {
		const rng = new Random(1);
		const ce = companyEmail(rng, en_US, {
			pattern: "flast",
			domain: "corp.example.com",
		});
		const un = username(new Random(1), en_US, { style: "first_last" });
		expect(ce).toMatch(emailRegex);
		expect(un).toMatch(/^[a-z0-9]+_[a-z0-9]+$/);
	});
	it("domain and url generation", () => {
		const dm = domain(new Random(2), en_US, { subdomain: true });
		const u = url(new Random(3), en_US, {
			https: true,
			subdomain: true,
			pathSegments: 3,
		});
		expect(dm.split(".").length).toBeGreaterThanOrEqual(2);
		expect(u.startsWith("https://")).toBe(true);
	});
	it("ips and mac", () => {
		const ip = ipv4(new Random(4));
		const ip6 = ipv6(new Random(5));
		const m = mac(new Random(6));
		expect(ipv4Re.test(ip)).toBe(true);
		expect(ip6.split(":").length).toBe(8);
		expect(macRe.test(m)).toBe(true);
	});
	it("http method/status", () => {
		const method = httpMethod(new Random(7));
		const status = httpStatus(new Random(8), { group: 4 });
		expect([
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"HEAD",
			"OPTIONS",
		]).toContain(method);
		expect(Math.floor(status.code / 100)).toBe(4);
	});
	it("uuidV4 and password", () => {
		const id = uuidV4(new Random(9));
		const pwd = password(new Random(10), { length: 14, symbols: true });
		expect(uuidRe.test(id)).toBe(true);
		expect(pwd.length).toBe(14);
	});
	it("port and safeEmail", () => {
		const p = port(new Random(11), { min: 2000, max: 3000 });
		const se = safeEmail(new Random(12));
		expect(p).toBeGreaterThanOrEqual(2000);
		expect(p).toBeLessThanOrEqual(3000);
		expect(se).toMatch(/@example\.(com|org|net)$/);
	});
});
