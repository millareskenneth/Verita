/**
 * Shared horizontal layout — balanced inset from screen edges.
 * max-w-[1560px] uses wide screens without feeling edge-to-edge.
 */
export const siteShellHorizontal =
  "mx-auto w-full max-w-[1560px] px-4 sm:px-5 lg:px-6";

/** Landing pages, header, footer */
export const landingShellClass = siteShellHorizontal;

/** API catalog, detail, search, category pages */
export const apiPageShellClass = `${siteShellHorizontal} py-6 lg:py-8`;
