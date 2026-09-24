import '@/views/film-info/film-info.styles.css';

import { useState } from 'react';

import FilmCard from '@/components/atoms/film-card/film-card.component';
import Container from '@/components/layout/container/container.component';
import { baseImagePath } from '@/services/config';
import type { PersonInfoType } from '@/types/people.types';
import { dedupeCredits, type DedupedCredit } from '@/utils/dedupeCredits';

const CREDITS_PREVIEW = 24;

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
      <section className="text-content mt-4 rounded-lg p-4 text-copy">
         <h2 className="mb-4 text-display-md">
            {title}
            <span className="ml-2 text-base font-normal tabular-nums opacity-70">
               ({credits.length})
            </span>
         </h2>
         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
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
               className="mt-4 text-accent hover:underline"
            >
               {showAll
                  ? 'Show fewer'
                  : `Show all ${credits.length.toLocaleString()}`}
            </button>
         )}
      </section>
   );
};

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
   const longBio = person.biography.length > 600;

   return (
      <Container>
         <div className="text-title text-copy">
            <span data-testid="person-info-title">{person.name}</span>
         </div>

         <div className="mx-auto w-full max-w-4xl px-4 py-6 text-copy">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
               {person.profile_path ? (
                  <img
                     loading="lazy"
                     src={`${baseImagePath}${person.profile_path}`}
                     alt=""
                     className="w-48 flex-none rounded-lg object-cover"
                  />
               ) : (
                  <div
                     aria-hidden="true"
                     className="flex h-72 w-48 flex-none items-center justify-center rounded-lg bg-gray-400/40 text-6xl"
                  >
                     👤
                  </div>
               )}

               <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h1 className="text-display-lg">{person.name}</h1>
                  {person.known_for_department && (
                     <p className="mt-1 text-sm uppercase tracking-wider text-copy/70">
                        {person.known_for_department}
                     </p>
                  )}

                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                     {born && (
                        <>
                           <dt className="font-semibold">Born</dt>
                           <dd className="tabular-nums">
                              {born}
                              {age !== null && !died ? ` (age ${age})` : ''}
                              {person.place_of_birth
                                 ? ` · ${person.place_of_birth}`
                                 : ''}
                           </dd>
                        </>
                     )}
                     {died && (
                        <>
                           <dt className="font-semibold">Died</dt>
                           <dd className="tabular-nums">
                              {died}
                              {age !== null ? ` (aged ${age})` : ''}
                           </dd>
                        </>
                     )}
                     {person.also_known_as &&
                        person.also_known_as.length > 0 && (
                           <>
                              <dt className="font-semibold">Also known as</dt>
                              <dd>
                                 {person.also_known_as.slice(0, 4).join(', ')}
                              </dd>
                           </>
                        )}
                  </dl>

                  {(person.homepage || imdbId) && (
                     <div className="mt-3 flex flex-wrap justify-center gap-4 sm:justify-start">
                        {person.homepage && (
                           <a
                              href={person.homepage}
                              target="_blank"
                              rel="noreferrer"
                              className="text-copy underline"
                           >
                              Homepage
                           </a>
                        )}
                        {imdbId && (
                           <a
                              href={`https://www.imdb.com/name/${imdbId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-copy underline"
                           >
                              IMDB
                           </a>
                        )}
                     </div>
                  )}
               </div>
            </div>

            {person.biography && (
               <section className="mt-6">
                  <h2 className="text-display-md">Biography</h2>
                  <p
                     className={`mt-2 whitespace-pre-line leading-relaxed ${
                        longBio && !bioExpanded ? 'line-clamp-6' : ''
                     }`}
                  >
                     {person.biography}
                  </p>
                  {longBio && (
                     <button
                        type="button"
                        onClick={() => setBioExpanded((v) => !v)}
                        className="mt-2 text-accent hover:underline"
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
