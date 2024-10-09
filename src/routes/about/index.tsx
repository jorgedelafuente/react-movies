import About from '@/views/about/about.view';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about/')({
   component: () => <About />,
});
