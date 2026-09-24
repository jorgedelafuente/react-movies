import './score-ring.styles.css';

import { EYEBROW } from '@/components/atoms/stat/stat.component';

type ScoreRingProps = {
   /** TMDB average on a 0–10 scale. Undefined or 0 means nobody has voted yet. */
   score?: number;
   votes?: number;
   /** Eyebrow beside the ring. */
   label?: string;
   className?: string;
};

/**
 * The headline number of a detail page: a ring that fills to the TMDB average
 * with the score inside, and an eyebrow plus vote count beside it. The arc
 * sweeps in once on mount (see the stylesheet) unless the visitor prefers
 * reduced motion. An unrated title shows an empty track and "NR" rather than a
 * misleading 0.0.
 */
const ScoreRing = ({
   score,
   votes,
   label = 'User score',
   className = '',
}: ScoreRingProps) => {
   const rated = score !== undefined && score > 0;
   const percent = rated ? Math.min(score, 10) * 10 : 0;

   return (
      <div
         className={`flex items-center gap-4 text-left ${className}`.trim()}
         data-testid="score-ring"
      >
         <div className="relative h-24 w-24 flex-none sm:h-28 sm:w-28">
            <svg
               viewBox="0 0 100 100"
               aria-hidden="true"
               className="h-full w-full -rotate-90"
            >
               <circle
                  cx="50"
                  cy="50"
                  r="44"
                  pathLength="100"
                  strokeWidth="6"
                  className="fill-none stroke-copy/10"
               />
               {rated && (
                  <circle
                     cx="50"
                     cy="50"
                     r="44"
                     pathLength="100"
                     strokeWidth="6"
                     strokeLinecap="round"
                     strokeDasharray="100"
                     strokeDashoffset={100 - percent}
                     className="score-ring__arc fill-none stroke-accent"
                     data-testid="score-ring-arc"
                  />
               )}
            </svg>
            <p className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 font-display font-semibold tabular-nums">
               {rated ? (
                  <>
                     <span className="text-display-lg leading-none">
                        {score.toFixed(1)}
                     </span>
                     <span className="font-sans text-xs font-medium text-copy/60">
                        / 10
                     </span>
                  </>
               ) : (
                  <span className="text-display-md text-copy/60">NR</span>
               )}
            </p>
         </div>
         <div className="flex flex-col gap-1">
            <span className={EYEBROW}>{label}</span>
            {rated ? (
               votes !== undefined && (
                  <span className="text-sm tabular-nums text-copy/70">
                     {votes.toLocaleString()} votes
                  </span>
               )
            ) : (
               <span className="text-sm text-copy/70">Not yet rated</span>
            )}
         </div>
      </div>
   );
};

export default ScoreRing;
