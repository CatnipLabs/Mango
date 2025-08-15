import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { en_US } from "../src/data/locales/en_US";
import { pt_BR } from "../src/data/locales/pt_BR";
import { email } from "../src/generators/internet";

const emailRegex = /^[a-z0-9]+(?:\.[a-z0-9]+)*@[a-z0-9.-]+\.[a-z]{2,}$/;

describe("internet", () => {
  it("email é determinístico com seed", () => {
    const rng1 = new Random(2024);
    const rng2 = new Random(2024);
    const a = email(rng1, pt_BR);
    const b = email(rng2, pt_BR);
    expect(a).toBe(b);
  });

  it("email possui formato válido (pt_BR)", () => {
    const a = email(new Random(5), pt_BR);
    expect(a).toMatch(emailRegex);
    const domain = a.split("@")[1];
    expect(pt_BR.internet.emailDomains).toContain(domain);
  });

  it("email possui formato válido (en_US)", () => {
    const a = email(new Random(7), en_US);
    expect(a).toMatch(emailRegex);
    const domain = a.split("@")[1];
    expect(en_US.internet.emailDomains).toContain(domain);
  });
});
