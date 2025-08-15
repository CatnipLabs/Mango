export type Locale = {
  readonly person: {
    readonly firstNames: readonly string[];
    readonly lastNames: readonly string[];
  };
  readonly internet: {
    readonly emailDomains: readonly string[];
  };
};

export * from "./en_US";
export * from "./pt_BR";
