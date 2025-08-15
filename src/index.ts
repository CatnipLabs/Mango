export { en_US } from "./data/locales/en_US";
export { pt_BR } from "./data/locales/pt_BR";
export { email } from "./generators/internet";
export { firstName, fullName, lastName } from "./generators/person";

import { Random } from "./core/random";
import { en_US as defaultLocale } from "./data/locales/en_US";
import { email as _email } from "./generators/internet";
import {
  firstName as _firstName,
  fullName as _fullName,
  lastName as _lastName,
} from "./generators/person";
import type { Locale } from "./types";

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
    firstName: () => _firstName(this.rng, this.locale),
    lastName: () => _lastName(this.rng, this.locale),
    fullName: () => _fullName(this.rng, this.locale),
  };
  internet = {
    email: () => _email(this.rng, this.locale),
  };
}
export const mango = new Mango();
