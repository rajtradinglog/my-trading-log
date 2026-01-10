const IS_PRODUCTION = false; // true = domain, false = localhost

export const APPLICATION_URL = IS_PRODUCTION
  ? "https://your-domain.com"
  : "http://localhost:4000";
