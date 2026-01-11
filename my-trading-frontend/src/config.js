const IS_PRODUCTION = true; // true = domain, false = localhost

export const APPLICATION_URL = IS_PRODUCTION
  ? "https://my-trading-log.onrender.com/"
  : "http://localhost:3000";
