export { en_US } from "./data/locales/en_US";
export { pt_BR } from "./data/locales/pt_BR";
export { firstName, lastName, fullName } from "./generators/person";
export { email } from "./generators/internet";

import type { Locale } from "./types";
import { Random } from "./core/random";
import { fullName as _fullName } from "./generators/person";
import { email as _email } from "./generators/internet";
import { en_US as defaultLocale } from "./data/locales/en_US";

export class Mango {
  private rng: Random;
  private locale: Locale;
  constructor(opts?: { seed?: number; locale?: Locale }) {
    this.rng = new Random(opts?.seed ?? 0xc0ffee);
    this.locale = opts?.locale ?? defaultLocale;
  }
  setSeed(seed: number) {
    this.rng.seed(seed);
  }
  setLocale(locale: Locale) {
    this.locale = locale;
  }

  person = {
    fullName: () => _fullName(this.rng, this.locale),
  };
  internet = {
    email: () => _email(this.rng, this.locale),
  };
}
export const mango = new Mango();
