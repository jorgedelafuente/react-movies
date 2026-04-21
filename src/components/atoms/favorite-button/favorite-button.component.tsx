import { useAuth } from '@/utils/hooks/useAuth';
import { useFavorites } from '@/utils/hooks/useFavorites';

type FavoriteButtonProps = {
   filmId: number;
   className?: string;
};

const FavoriteButton = ({ filmId, className = '' }: FavoriteButtonProps) => {
   const user = useAuth((s) => s.user);
   const { isFavorited, toggle, isPending } = useFavorites();

   if (!user) return null;

   const favorited = isFavorited(filmId);

   const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggle(filmId);
   };

   return (
      <button
         type='button'
         onClick={handleClick}
         disabled={isPending}
         aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
         className={`cursor-pointer disabled:opacity-50 ${className}`.trim()}
      >
         {favorited ? <HeartFilledIcon /> : <HeartOutlineIcon />}
      </button>
   );
};

export default FavoriteButton;

const HeartFilledIcon = () => (
   <svg
      viewBox='0 0 24 24'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-7 w-7'
   >
      <path
         d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
         className='fill-sky-500 stroke-sky-500'
      />
   </svg>
);

const HeartOutlineIcon = () => (
   <svg
      viewBox='0 0 24 24'
      fill='none'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-7 w-7'
   >
      <path
         d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
         className='fill-sky-400/20 stroke-sky-500'
      />
   </svg>
);
