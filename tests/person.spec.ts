import { describe, it, expect } from "vitest";
import { Random } from "../src/core/random";
import { pt_BR } from "../src/data/locales/pt_BR";
import { fullName } from "../src/generators/person";

describe("person", () => {
  it("gera nome determinístico com seed", () => {
    const a = fullName(new Random(42), pt_BR);
    const b = fullName(new Random(42), pt_BR);
    expect(a).toBe(b);
  });
});
