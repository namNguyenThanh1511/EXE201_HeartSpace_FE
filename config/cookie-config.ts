interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
  domain?: string;
}

/**
 * Get secure cookie configuration based on environment
 * This ensures cookies work in both development (HTTP) and production (HTTPS)
 */
export function getSecureCookieConfig(customOptions: Partial<CookieOptions> = {}): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecureEnvironment =
    typeof window !== "undefined" ? window.location.protocol === "https:" : isProduction;

  const defaultConfig: CookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    secure: isSecureEnvironment, // true for HTTPS, false for HTTP
    sameSite: isSecureEnvironment ? "strict" : "lax", // More secure in production
    httpOnly: false, // Allow JavaScript access for client-side auth state
  };

  // In production, add domain if specified
  if (isProduction && ".revoland.vn") {
    defaultConfig.domain = ".revoland.vn";
  }

  return { ...defaultConfig, ...customOptions };
}

/**
 * Get cookie configuration for authentication tokens
 * Optimized for auth token security and accessibility
 */
export function getAuthCookieConfig(rememberMe: boolean = false): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecureEnvironment =
    typeof window !== "undefined" ? window.location.protocol === "https:" : isProduction;

  // Different expiration times based on "remember me" option
  const maxAge = rememberMe
    ? 60 * 60 * 24 * 30 // 30 days if remember me is checked
    : 60 * 60 * 24 * 7; // 7 days if remember me is not checked

  return {
    maxAge,
    httpOnly: false, // Allow JavaScript access for client-side state management
    path: "/",
    secure: isSecureEnvironment, // true for HTTPS, false for HTTP
    sameSite: "lax", // Better for same-site applications than 'none'
    domain: isProduction ? ".revoland.vn" : undefined, // Use undefined for localhost
  };
}

/**
 * Alternative: Get configuration for httpOnly refresh token
 * This would be used if implementing a dual-token system
 */
export function getRefreshTokenCookieConfig(): CookieOptions {
  return getSecureCookieConfig({
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true, // More secure, server-only access
  });
}
