/**
 * TMDB reports runtimes in whole minutes. Render them the way a listing
 * would: `128` → `2h 8m`, `45` → `45m`, `60` → `1h`.
 */
export const formatRuntime = (minutes: number) => {
   const hours = Math.floor(minutes / 60);
   const rest = minutes % 60;
   if (hours === 0) return `${rest}m`;
   return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
};
