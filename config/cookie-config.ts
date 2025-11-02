interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
  domain?: string;
}

export function getSecureCookieConfig(customOptions: Partial<CookieOptions> = {}): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecureEnvironment =
    typeof window !== "undefined" ? window.location.protocol === "https:" : isProduction;

  const defaultConfig: CookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    secure: isSecureEnvironment,
    sameSite: isSecureEnvironment ? "none" : "lax",
    httpOnly: false,
  };

  if (isProduction && process.env.NEXT_PUBLIC_COOKIE_DOMAIN) {
    defaultConfig.domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  }

  return { ...defaultConfig, ...customOptions };
}

export function getAuthCookieConfig(rememberMe: boolean = false): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecureEnvironment =
    typeof window !== "undefined" ? window.location.protocol === "https:" : isProduction;

  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

  return {
    maxAge,
    httpOnly: false,
    path: "/",
    secure: isSecureEnvironment,
    sameSite: isSecureEnvironment ? "none" : "lax",
    // domain: isProduction ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN : undefined,
  };
}

export function getRefreshTokenCookieConfig(): CookieOptions {
  return getSecureCookieConfig({
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  });
}
