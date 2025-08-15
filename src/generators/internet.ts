import type { Random } from "../core/random";
import type { Locale } from "../types";
import { firstName, lastName } from "./person";

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, ".");

export function email(rng: Random, locale: Locale): string {
  const fn = slug(firstName(rng, locale));
  const ln = slug(lastName(rng, locale));
  const ds = locale.internet.emailDomains;
  return `${fn}.${ln}@${ds[rng.int(0, ds.length - 1)]}`;
}
