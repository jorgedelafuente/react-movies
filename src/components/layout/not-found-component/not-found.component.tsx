import { Link } from '@tanstack/react-router';
import Container from '../container/container.component';

export function NotFoundComponent() {
   return (
      <Container>
         <p className="text-copy mb-8 p-4">404 Page Not Found...</p>
         <button>
            <Link to="/">
               <span className="text-copy rounded-lg border-2 border-solid border-blue-700 p-4 hover:bg-blue-900 hover:text-slate-300">
                  Start Over
               </span>
            </Link>
         </button>
      </Container>
   );
}
