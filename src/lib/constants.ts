export const TERRITORY_COUNTRIES: Record<string, string[]> = {
  BR: ["BR"],
  USA: ["US"],
  LATAM: [
    "MX",
    "CO",
    "AR",
    "CL",
    "PE",
    "EC",
    "GT",
    "BO",
    "DO",
    "HN",
    "PY",
    "SV",
    "NI",
    "CR",
    "PA",
    "UY",
    "VE",
    "CU",
  ],
};

export const TERRITORY_TIMEZONES: Record<string, string> = {
  BR: "America/Sao_Paulo",
  USA: "America/New_York",
  LATAM: "America/Mexico_City",
};

export const COUNTRY_NAMES: Record<string, string> = {
  BR: "Brasil",
  US: "Estados Unidos",
  MX: "México",
  CO: "Colombia",
  AR: "Argentina",
  CL: "Chile",
  PE: "Perú",
  EC: "Ecuador",
  GT: "Guatemala",
  BO: "Bolivia",
  DO: "República Dominicana",
  HN: "Honduras",
  PY: "Paraguay",
  SV: "El Salvador",
  NI: "Nicaragua",
  CR: "Costa Rica",
  PA: "Panamá",
  UY: "Uruguay",
  VE: "Venezuela",
  CU: "Cuba",
};

export const MAX_OFFERS = 20;
export const SNAPSHOT_HOURS = [10, 22];
export const META_API_VERSION =
  process.env.META_API_VERSION ?? "v23.0";
export const META_API_BASE_URL = "https://graph.facebook.com";
export const META_API_ADS_PER_PAGE = 500;
export const META_API_MAX_PAGES = 10;
export const COLLECTION_CONCURRENCY = 5;
