import { Link } from '@tanstack/react-router';

import { baseImagePath } from '@/services/config';
import type { CastMemberType } from '@/types/films.types';

/** Cast grid shared by the film and series detail pages; each member links to their person page. */
const CastList = ({ cast }: { cast: CastMemberType[] }) => {
   if (cast.length === 0) return null;
   return (
      <div className="flex flex-wrap justify-center gap-4">
         {cast.map((member) => (
            <Link
               key={`${member.id}-${member.character}`}
               to="/person/$personId"
               params={{ personId: String(member.id) }}
               className="flex w-20 flex-col items-center gap-1 text-center text-inherit hover:text-accent"
            >
               {member.profile_path ? (
                  <img
                     loading="lazy"
                     src={`${baseImagePath}${member.profile_path}`}
                     alt=""
                     className="h-16 w-16 rounded-full object-cover object-top"
                  />
               ) : (
                  <div
                     aria-hidden="true"
                     className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400 text-2xl text-white"
                  >
                     👤
                  </div>
               )}
               <span className="font-display text-sm font-semibold leading-tight">
                  {member.name}
               </span>
               <span className="text-xs leading-tight text-copy/70">
                  {member.character}
               </span>
            </Link>
         ))}
      </div>
   );
};

export default CastList;
