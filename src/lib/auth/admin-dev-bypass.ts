/**
 * Skip admin login locally while splitting the admin app out of Verita.
 * Requires backend APP_ENV=development with ADMIN_API_KEY unset.
 */
export const ADMIN_DEV_BYPASS =
  process.env.NEXT_PUBLIC_ADMIN_DEV_BYPASS === "true";
