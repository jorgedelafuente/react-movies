import { baseImagePathAvatar } from '@/services/config';

/**
 * Turns a TMDB `avatar_path` into something an `<img>` can load.
 *
 * TMDB mixes two formats in the same field: a relative profile path
 * (`/abc.jpg`) that needs the image CDN prefix, and a full Gravatar URL
 * prefixed with a stray slash (`/https://secure.gravatar.com/...`).
 */
export const resolveAvatarUrl = (avatarPath: string | null): string | null => {
   if (!avatarPath) {
      return null;
   }

   const trimmed = avatarPath.replace(/^\/+/, '');

   if (/^https?:\/\//.test(trimmed)) {
      return trimmed;
   }

   return `${baseImagePathAvatar}${trimmed}`;
};
