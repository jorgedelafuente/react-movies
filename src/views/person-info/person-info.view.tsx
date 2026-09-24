import { useState } from 'react';

import FilmCard from '@/components/atoms/film-card/film-card.component';
import { ExternalLink } from '@/components/atoms/link/external-link.component';
import MediaImage from '@/components/atoms/media-image/media-image.component';
import {
   EYEBROW,
   Stat,
   StatNote,
} from '@/components/atoms/stat/stat.component';
import Container from '@/components/layout/container/container.component';
import type { PersonInfoType } from '@/types/people.types';
import { dedupeCredits, type DedupedCredit } from '@/utils/dedupeCredits';

const CREDITS_PREVIEW = 24;
const ALIASES_LIMIT = 4;
const LONG_BIO = 600;

/** Portrait box shared by the photo and its placeholder. */
const PORTRAIT =
   'aspect-[2/3] w-56 flex-none rounded-2xl object-cover object-top shadow-lg sm:w-64 lg:w-72';

const formatDate = (iso: string | null) => {
   if (!iso) return null;
   const d = new Date(iso);
   return isNaN(d.getTime())
      ? null
      : d.toLocaleDateString('en-GB', {
           day: '2-digit',
           month: 'long',
           year: 'numeric',
        });
};

const yearsBetween = (from: string | null, to: string | null) => {
   if (!from) return null;
   const start = new Date(from);
   const end = to ? new Date(to) : new Date();
   if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
   let years = end.getFullYear() - start.getFullYear();
   const beforeBirthday =
      end.getMonth() < start.getMonth() ||
      (end.getMonth() === start.getMonth() && end.getDate() < start.getDate());
   if (beforeBirthday) years -= 1;
   return years;
};

const CreditsGrid = ({
   title,
   credits,
   rolePrefix,
}: {
   title: string;
   credits: DedupedCredit[];
   rolePrefix?: string;
}) => {
   const [showAll, setShowAll] = useState(false);
   if (credits.length === 0) return null;
   const visible = showAll ? credits : credits.slice(0, CREDITS_PREVIEW);

   return (
      <section className="border-t border-copy/10 pt-8">
         <h2 className="text-display-md">
            {title}
            <span className="ml-2 font-sans text-base font-normal tabular-nums text-copy/60">
               ({credits.length})
            </span>
         </h2>
         <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {visible.map((credit) => (
               <FilmCard
                  key={`${credit.media_type}-${credit.id}`}
                  id={credit.id}
                  media_type={credit.media_type}
                  title={credit.title}
                  poster_path={credit.poster_path}
                  release_date={credit.release_date}
                  overview={
                     credit.roles.length > 0
                        ? `${rolePrefix ?? ''}${credit.roles.join(' / ')}`
                        : undefined
                  }
                  showFavorite={false}
               />
            ))}
         </div>
         {credits.length > CREDITS_PREVIEW && (
            <button
               type="button"
               onClick={() => setShowAll((v) => !v)}
               className="mt-6 text-sm font-medium text-accent hover:underline"
            >
               {showAll
                  ? 'Show fewer'
                  : `Show all ${credits.length.toLocaleString()}`}
            </button>
         )}
      </section>
   );
};

/**
 * Profile page. Unlike the film and series pages there is no backdrop, so no
 * parallax hero, no sticky title and no hover fades: a plain column with a
 * portrait header, then biography and credits under hairline rules.
 */
const PersonInfo = ({ person }: { person: PersonInfoType }) => {
   const [bioExpanded, setBioExpanded] = useState(false);
   const cast = dedupeCredits(
      person.combined_credits?.cast ?? [],
      (c) => c.character
   );
   const crew = dedupeCredits(
      person.combined_credits?.crew ?? [],
      (c) => c.job
   );
   const imdbId = person.external_ids?.imdb_id;
   const born = formatDate(person.birthday);
   const died = formatDate(person.deathday);
   const age = yearsBetween(person.birthday, person.deathday);
   const aliases = person.also_known_as?.slice(0, ALIASES_LIMIT) ?? [];
   const longBio = person.biography.length > LONG_BIO;

   return (
      <Container>
         <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-6 text-left text-copy">
            <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-10 sm:text-left">
               <MediaImage
                  path={person.profile_path}
                  alt=""
                  variant="person"
                  className={PORTRAIT}
               />

               <div className="flex min-w-0 flex-1 flex-col items-center gap-6 sm:items-start">
                  <div className="flex flex-col gap-2">
                     {person.known_for_department && (
                        <p className={EYEBROW}>{person.known_for_department}</p>
                     )}
                     <h1
                        className="text-display-xl"
                        data-testid="person-info-title"
                     >
                        {person.name}
                     </h1>
                  </div>

                  {(born || died || person.place_of_birth) && (
                     <dl className="flex flex-wrap justify-center gap-x-10 gap-y-5 sm:justify-start">
                        {born && (
                           <Stat label="Born" className="sm:items-start">
                              {born}
                              {age !== null && !died && (
                                 <StatNote>(age {age})</StatNote>
                              )}
                           </Stat>
                        )}
                        {died && (
                           <Stat label="Died" className="sm:items-start">
                              {died}
                              {age !== null && (
                                 <StatNote>(aged {age})</StatNote>
                              )}
                           </Stat>
                        )}
                        {person.place_of_birth && (
                           <Stat label="Birthplace" className="sm:items-start">
                              {person.place_of_birth}
                           </Stat>
                        )}
                     </dl>
                  )}

                  {aliases.length > 0 && (
                     <div className="flex flex-col items-center gap-1 sm:items-start">
                        <span className={EYEBROW}>Also known as</span>
                        <p className="text-sm text-copy/80">
                           {aliases.join(' · ')}
                        </p>
                     </div>
                  )}

                  {(person.homepage || imdbId) && (
                     <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                        {person.homepage && (
                           <ExternalLink href={person.homepage}>
                              Homepage
                           </ExternalLink>
                        )}
                        {imdbId && (
                           <ExternalLink
                              href={`https://www.imdb.com/name/${imdbId}`}
                           >
                              IMDb
                           </ExternalLink>
                        )}
                     </div>
                  )}
               </div>
            </header>

            {person.biography && (
               <section className="border-t border-copy/10 pt-8">
                  <h2 className="text-display-md">Biography</h2>
                  <p
                     className={`mt-4 max-w-prose whitespace-pre-line text-pretty leading-relaxed sm:text-lg ${
                        longBio && !bioExpanded ? 'line-clamp-6' : ''
                     }`}
                  >
                     {person.biography}
                  </p>
                  {longBio && (
                     <button
                        type="button"
                        onClick={() => setBioExpanded((v) => !v)}
                        className="mt-3 text-sm font-medium text-accent hover:underline"
                        aria-expanded={bioExpanded}
                     >
                        {bioExpanded ? 'Read less' : 'Read more'}
                     </button>
                  )}
               </section>
            )}

            <CreditsGrid title="Known for" credits={cast} rolePrefix="as " />
            <CreditsGrid title="Crew" credits={crew} />
         </div>
      </Container>
   );
};

export default PersonInfo;
