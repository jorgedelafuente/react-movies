import { Link } from '@tanstack/react-router';

export function NotFoundComponent() {
   return (
      <div className="p-4">
         <p className="mb-8">404 Page Not Found...</p>
         <button>
            <Link to="/">
               <span className="rounded-lg border-2 border-solid border-blue-700 p-4 text-white hover:bg-blue-900 hover:text-slate-300">
                  Start Over
               </span>
            </Link>
         </button>
      </div>
   );
}
