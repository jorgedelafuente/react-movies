import { Link } from '@tanstack/react-router';

import { MEDIA_TYPES, type MediaType } from '@/types/media.types';

type MediaLinkProps = {
   id: number;
   mediaType: MediaType;
   className?: string;
   children: React.ReactNode;
};

/**
 * Links to the detail page for a film or a series. TMDB movie and TV ids
 * overlap, so the route must be chosen by media type, never by id alone.
 */
const MediaLink = ({ id, mediaType, className, children }: MediaLinkProps) =>
   mediaType === MEDIA_TYPES.TV ? (
      <Link
         to="/tv/$seriesId"
         params={{ seriesId: String(id) }}
         className={className}
      >
         {children}
      </Link>
   ) : (
      <Link
         to="/film/$filmId"
         params={{ filmId: String(id) }}
         className={className}
      >
         {children}
      </Link>
   );

export default MediaLink;
