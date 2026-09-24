import { Link } from '@tanstack/react-router';

import MediaImage from '@/components/atoms/media-image/media-image.component';
import type { CastMemberType } from '@/types/films.schemas';

/** Rows hold at most this many members; longer lists split evenly across two rows. */
const MAX_PER_ROW = 6;
/** Column width (`w-[7.5rem]`) plus the `gap-4` (1rem) that follows it. */
const COLUMN_REM = 8.5;

/** Cast grid shared by the film and series detail pages; each member links to their person page. */
const CastList = ({ cast }: { cast: CastMemberType[] }) => {
   if (cast.length === 0) return null;
   const perRow =
      cast.length > MAX_PER_ROW ? Math.ceil(cast.length / 2) : cast.length;
   return (
      <div
         className="mx-auto flex flex-wrap justify-center gap-4"
         style={{ maxWidth: `${perRow * COLUMN_REM}rem` }}
      >
         {cast.map((member) => (
            <Link
               key={`${member.id}-${member.character}`}
               to="/person/$personId"
               params={{ personId: String(member.id) }}
               className="group flex w-[7.5rem] flex-col items-center gap-1.5 text-center text-inherit hover:text-accent"
            >
               <MediaImage
                  path={member.profile_path}
                  alt=""
                  variant="person"
                  className="aspect-[3/4] w-full rounded-2xl object-cover object-top transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
               />
               <span className="relative z-10 font-display text-sm font-semibold leading-tight">
                  {member.name}
               </span>
               <span className="relative z-10 text-xs leading-tight text-copy/70">
                  {member.character}
               </span>
            </Link>
         ))}
      </div>
   );
};

export default CastList;
